# Spesifikasi Perbaikan: Error 404 pada Fitur Chat

## 1. Ringkasan Masalah

### Deskripsi Error
- **Error**: `Failed to load resource: the server responded with a status of 404 (Not Found)`
- **Endpoint**: `http://localhost:3000/api/chat/messages`
- **Dampak**: Semua fitur chat tidak dapat berfungsi (kirim pesan, buat room, dll.)

### Error Log Browser
```
:3000/api/chat/messages:1   Failed to load resource: the server responded with a status of 404 (Not Found)
```

---

## 2. Analisis Root Cause

### 2.1 Arsitektur Sistem
```
Frontend (Port 4000)                    Backend (Port 3000)
┌─────────────────────┐                ┌─────────────────────────────────┐
│  React/Vite App     │   HTTP/WS      │  NestJS API Server              │
│  ┌───────────────┐  │  ────────►     │  ┌─────────────────────────────┐│
│  │ use-chat.ts   │  │                │  │ ChatController              ││
│  │ apiClient.post│  │                │  │ @Controller("chat")         ││
│  │ /chat/messages│  │                │  │   POST /messages            ││
│  └───────────────┘  │                │  └─────────────────────────────┘│
└─────────────────────┘                └─────────────────────────────────┘
```

### 2.2 Endpoint yang Terkena Dampak
| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/api/chat/rooms` | GET | Mendapatkan daftar chat room |
| `/api/chat/rooms` | POST | Membuat chat room baru |
| `/api/chat/rooms/:id` | GET | Mendapatkan detail chat room |
| `/api/chat/rooms/:id/messages` | GET | Mendapatkan pesan dalam room |
| `/api/chat/messages` | POST | **MENGIRIM PESAN (ERROR 404)** |
| `/api/chat/rooms/:id/read` | POST | Menandai pesan sudah dibaca |
| `/api/chat/unread-count` | GET | Mendapatkan jumlah pesan belum dibaca |
| `/api/chat/order/:orderId` | GET | Mendapatkan chat room untuk order |
| `/api/chat/order/:orderId/status` | GET | Mendapatkan status chat |

### 2.3 Kemungkinan Penyebab

#### A. Middleware Route Pattern Issue
**Lokasi**: `backend/src/app.module.ts` (line 184-186)

```typescript
.forRoutes({
    path: "api/*",
    method: RequestMethod.ALL,
});
```

**Masalah**: Pattern `api/*` mungkin tidak cocok dengan path nested seperti `api/chat/messages`. NestJS memerlukan pattern `api/**` untuk mencocokkan semua level path.

#### B. Controller Tidak Teregistrasi dengan Benar
- ChatModule sudah diimport di AppModule (line 116)
- ChatController sudah ada di array controllers (line 138)
- Namun mungkin ada issue pada compile/build

#### C. Backend Server Tidak Running atau Perlu Rebuild
- Server mungkin running dengan kode lama (dist folder)
- Perlu rebuild dan restart server

#### D. Port Conflict
- Kemungkinan ada proses lain yang running di port 3000
- Menyebabkan request tidak sampai ke NestJS server

---

## 3. User Stories & Acceptance Criteria

### US-1: Customer Dapat Mengirim Pesan ke Merchant
**Sebagai** customer yang sedang menunggu pesanan,
**Saya ingin** mengirim pesan ke merchant,
**Agar** saya dapat mengkomunikasikan permintaan khusus atau menanyakan status pesanan.

**Acceptance Criteria:**
1. ✅ Ketika order status adalah `PAID`, `PREPARING`, atau `READY`, tombol chat dengan merchant tersedia
2. ✅ Ketika user mengklik tombol chat, chat window terbuka dengan sukses
3. ✅ User dapat mengetik pesan di input field
4. ✅ Ketika user mengirim pesan, pesan terkirim tanpa error 404
5. ✅ Pesan yang terkirim muncul di chat window dengan status sent
6. ✅ Penerima (merchant) menerima notifikasi pesan baru secara real-time
7. ✅ Response time untuk mengirim pesan < 2 detik

### US-2: Customer Dapat Mengirim Pesan ke Driver
**Sebagai** customer yang pesanannya sedang dalam pengiriman,
**Saya ingin** mengirim pesan ke driver,
**Agar** saya dapat memberikan instruksi tambahan terkait lokasi pengiriman.

**Acceptance Criteria:**
1. ✅ Ketika order status adalah `ON_DELIVERY` dan driver sudah assigned, tombol chat dengan driver tersedia
2. ✅ User dapat membuka chat window dengan driver
3. ✅ User dapat mengirim pesan ke driver tanpa error
4. ✅ Driver menerima pesan secara real-time
5. ✅ Ketika order status berubah ke `DELIVERED`, chat otomatis di-close

### US-3: Merchant Dapat Merespon Pesan Customer
**Sebagai** merchant,
**Saya ingin** merespon pesan dari customer,
**Agar** saya dapat menjawab pertanyaan dan memberikan update tentang pesanan.

**Acceptance Criteria:**
1. ✅ Merchant dapat melihat daftar chat room dari semua customer
2. ✅ Merchant dapat membuka chat window dan melihat pesan
3. ✅ Merchant dapat membalas pesan tanpa error 404
4. ✅ Customer menerima balasan secara real-time
5. ✅ Badge notifikasi menunjukkan jumlah pesan belum dibaca yang akurat

### US-4: Driver Dapat Berkomunikasi dengan Customer
**Sebagai** driver,
**Saya ingin** berkomunikasi dengan customer,
**Agar** saya dapat mengkonfirmasi lokasi atau memberitahu estimasi waktu tiba.

**Acceptance Criteria:**
1. ✅ Driver dapat melihat chat dengan customer untuk order yang sedang di-handle
2. ✅ Driver dapat mengirim pesan ke customer
3. ✅ Pesan terkirim dengan sukses tanpa error
4. ✅ Customer menerima pesan real-time

### US-5: Sistem Chat Memiliki Error Handling yang Baik
**Sebagai** user (customer/merchant/driver),
**Saya ingin** melihat error message yang jelas ketika ada masalah,
**Agar** saya mengerti apa yang terjadi dan apa yang harus dilakukan.

**Acceptance Criteria:**
1. ✅ Ketika koneksi terputus, user melihat indikator "Reconnecting..."
2. ✅ Ketika gagal mengirim pesan karena network error, muncul toast error yang informatif
3. ✅ Ketika chat room sudah ditutup, user melihat pesan bahwa chat sudah tidak aktif
4. ✅ Ketika terjadi error 403 (forbidden), user melihat pesan yang menjelaskan alasannya

---

## 4. Solusi yang Diusulkan

### 4.1 Fix: Update Middleware Route Pattern
**File**: `backend/src/app.module.ts`

**Perubahan**:
```typescript
// SEBELUM (line 184-186)
.forRoutes({
    path: "api/*",
    method: RequestMethod.ALL,
});

// SESUDAH
.forRoutes({
    path: "api/**",  // Gunakan ** untuk match semua nested paths
    method: RequestMethod.ALL,
});
```

### 4.2 Alternative Fix: Daftarkan Routes Secara Eksplisit
Jika fix pertama tidak berhasil, daftarkan routes secara eksplisit:

```typescript
.forRoutes(
  { path: 'api/chat', method: RequestMethod.ALL },
  { path: 'api/chat/*', method: RequestMethod.ALL },
  { path: 'api/users', method: RequestMethod.ALL },
  { path: 'api/users/*', method: RequestMethod.ALL },
  // ... routes lainnya
);
```

### 4.3 Verifikasi Route Registration
Tambahkan logging untuk memverifikasi route registration:

**File**: `backend/src/main.ts`
```typescript
// Setelah app.init() atau sebelum app.listen()
const server = app.getHttpAdapter();
const router = server.getInstance()._router;
console.log('Registered routes:', router.stack
  .filter(r => r.route)
  .map(r => ({
    path: r.route.path,
    methods: Object.keys(r.route.methods)
  }))
);
```

---

## 5. Rencana Implementasi

### Phase 1: Diagnosis (30 menit)
| No | Task | Waktu |
|----|------|-------|
| 1.1 | Verifikasi backend server running di port 3000 | 5 min |
| 1.2 | Test endpoint langsung via cURL/Postman | 10 min |
| 1.3 | Check backend logs untuk error | 5 min |
| 1.4 | Verifikasi tidak ada port conflict | 5 min |
| 1.5 | Check build output (dist folder) | 5 min |

### Phase 2: Fix Implementation (45 menit)
| No | Task | Waktu |
|----|------|-------|
| 2.1 | Update middleware route pattern di app.module.ts | 10 min |
| 2.2 | Rebuild backend (`npm run build`) | 5 min |
| 2.3 | Restart backend server | 5 min |
| 2.4 | Test endpoint POST /api/chat/messages | 10 min |
| 2.5 | Jika masih error, implementasi alternative fix | 15 min |

### Phase 3: Testing Manual (30 menit)
| No | Task | Waktu |
|----|------|-------|
| 3.1 | Test kirim pesan sebagai customer ke merchant | 5 min |
| 3.2 | Test kirim pesan sebagai merchant ke customer | 5 min |
| 3.3 | Test kirim pesan sebagai customer ke driver | 5 min |
| 3.4 | Test kirim pesan sebagai driver ke customer | 5 min |
| 3.5 | Test real-time message delivery via WebSocket | 5 min |
| 3.6 | Test error handling (chat closed, unauthorized) | 5 min |

### Phase 4: Automated Testing (45 menit)
| No | Task | Waktu |
|----|------|-------|
| 4.1 | Run existing e2e tests untuk chat | 10 min |
| 4.2 | Tambahkan test case baru jika diperlukan | 20 min |
| 4.3 | Verifikasi semua test case pass | 10 min |
| 4.4 | Check code coverage | 5 min |

### Phase 5: Regression Testing (20 menit)
| No | Task | Waktu |
|----|------|-------|
| 5.1 | Test fitur lain yang mungkin terdampak | 10 min |
| 5.2 | Test authentication flow | 5 min |
| 5.3 | Test order flow end-to-end | 5 min |

---

## 6. Test Cases

### 6.1 Unit Test: Chat Service
```typescript
describe('ChatService', () => {
  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const data = {
        chatRoomId: 'room-123',
        content: 'Hello, when will my order be ready?'
      };
      
      // Act
      const result = await chatService.sendMessage(userId, data);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.content).toBe(data.content);
      expect(result.senderId).toBe(userId);
    });

    it('should reject empty message', async () => {
      // Arrange
      const data = { chatRoomId: 'room-123', content: '' };
      
      // Act & Assert
      await expect(chatService.sendMessage('user-123', data))
        .rejects.toThrow('Message content cannot be empty');
    });

    it('should reject message to non-existent room', async () => {
      // Arrange
      const data = { chatRoomId: 'non-existent', content: 'Hello' };
      
      // Act & Assert
      await expect(chatService.sendMessage('user-123', data))
        .rejects.toThrow('Chat room not found');
    });

    it('should reject message when chat is closed', async () => {
      // Arrange: Chat room with order status DELIVERED
      const data = { chatRoomId: 'closed-room', content: 'Hello' };
      
      // Act & Assert
      await expect(chatService.sendMessage('user-123', data))
        .rejects.toThrow(/closed/);
    });
  });
});
```

### 6.2 E2E Test: Chat API
```typescript
describe('POST /api/chat/messages', () => {
  it('should return 201 when message sent successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/chat/messages')
      .set('Cookie', authCookie)
      .send({
        chatRoomId: testChatRoom.id,
        content: 'Test message'
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.content).toBe('Test message');
  });

  it('should return 400 for empty message', async () => {
    await request(app.getHttpServer())
      .post('/api/chat/messages')
      .set('Cookie', authCookie)
      .send({
        chatRoomId: testChatRoom.id,
        content: ''
      })
      .expect(400);
  });

  it('should return 401 when not authenticated', async () => {
    await request(app.getHttpServer())
      .post('/api/chat/messages')
      .send({
        chatRoomId: testChatRoom.id,
        content: 'Test'
      })
      .expect(401);
  });

  it('should return 404 for non-existent chat room', async () => {
    await request(app.getHttpServer())
      .post('/api/chat/messages')
      .set('Cookie', authCookie)
      .send({
        chatRoomId: 'non-existent-id',
        content: 'Test'
      })
      .expect(404);
  });

  it('should return 403 when chat is closed', async () => {
    // Update order to DELIVERED status first
    await request(app.getHttpServer())
      .post('/api/chat/messages')
      .set('Cookie', authCookie)
      .send({
        chatRoomId: closedChatRoom.id,
        content: 'Test'
      })
      .expect(403);
  });
});
```

### 6.3 Integration Test: Real-time Message Delivery
```typescript
describe('Chat WebSocket Integration', () => {
  it('should deliver message in real-time to other participants', async () => {
    // Connect two clients (customer and merchant)
    const customerSocket = io(`${SOCKET_URL}/chat`, { auth: { userId: customerId }});
    const merchantSocket = io(`${SOCKET_URL}/chat`, { auth: { userId: merchantId }});
    
    await Promise.all([
      waitForConnect(customerSocket),
      waitForConnect(merchantSocket)
    ]);
    
    // Both join the same room
    customerSocket.emit('chat:join', { chatRoomId });
    merchantSocket.emit('chat:join', { chatRoomId });
    
    // Set up listener on merchant side
    const messagePromise = new Promise(resolve => {
      merchantSocket.on('chat:message', resolve);
    });
    
    // Customer sends message via HTTP
    await request(app.getHttpServer())
      .post('/api/chat/messages')
      .set('Cookie', customerAuthCookie)
      .send({
        chatRoomId,
        content: 'Hello merchant!'
      });
    
    // Verify merchant received the message
    const receivedMessage = await messagePromise;
    expect(receivedMessage.content).toBe('Hello merchant!');
    
    // Cleanup
    customerSocket.disconnect();
    merchantSocket.disconnect();
  });
});
```

### 6.4 Frontend Integration Test
```typescript
describe('ChatWindow Component', () => {
  it('should send message and update UI', async () => {
    // Render chat window
    render(<ChatWindow chatRoom={mockChatRoom} onClose={jest.fn()} />);
    
    // Type message
    const input = screen.getByPlaceholderText(/type a message/i);
    await userEvent.type(input, 'Hello!');
    
    // Click send
    const sendButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(sendButton);
    
    // Verify message appears in chat
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });
    
    // Verify input is cleared
    expect(input).toHaveValue('');
  });

  it('should show error toast when send fails', async () => {
    // Mock API to return error
    server.use(
      rest.post('/api/chat/messages', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );
    
    render(<ChatWindow chatRoom={mockChatRoom} onClose={jest.fn()} />);
    
    await userEvent.type(screen.getByPlaceholderText(/type/i), 'Test');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  });
});
```

---

## 7. Kriteria Keberhasilan

### 7.1 Functional Requirements
- [ ] Semua endpoint chat API mengembalikan response yang benar (bukan 404)
- [ ] Customer dapat mengirim pesan ke merchant saat order dalam status PAID/PREPARING/READY
- [ ] Customer dapat mengirim pesan ke driver saat order dalam status ON_DELIVERY
- [ ] Merchant dapat membalas pesan customer
- [ ] Driver dapat membalas pesan customer
- [ ] Pesan terkirim secara real-time melalui WebSocket
- [ ] Badge unread count terupdate secara akurat

### 7.2 Non-Functional Requirements
- [ ] Response time untuk API chat < 500ms (p95)
- [ ] WebSocket message latency < 200ms
- [ ] Tidak ada memory leak pada koneksi WebSocket
- [ ] Error rate < 0.1%

### 7.3 Test Coverage
- [ ] Unit test coverage untuk ChatService > 80%
- [ ] E2E test untuk semua endpoint chat passing
- [ ] Integration test untuk WebSocket passing
- [ ] Frontend component test passing

### 7.4 Definition of Done
1. ✅ Error 404 tidak lagi muncul saat mengirim pesan
2. ✅ Semua automated tests passing
3. ✅ Manual testing selesai tanpa bug
4. ✅ Code review approved
5. ✅ Deployed ke staging dan verified
6. ✅ Dokumentasi diupdate jika diperlukan

---

## 8. Rollback Plan

Jika fix menyebabkan issue baru:

1. **Revert Code Changes**
   ```bash
   git revert <commit-hash>
   ```

2. **Rebuild dan Restart**
   ```bash
   cd backend
   npm run build
   npm run start
   ```

3. **Verify Rollback**
   - Test endpoint yang sebelumnya bekerja
   - Pastikan tidak ada regression baru

---

## 9. Monitoring & Alerting

### Metrics to Monitor
- API response time untuk `/api/chat/*`
- Error rate per endpoint
- WebSocket connection count
- Message delivery latency

### Alerts
- Alert jika error rate > 1% dalam 5 menit
- Alert jika response time p95 > 2 detik
- Alert jika WebSocket connection drops > 10% dalam 1 menit

---

## 10. Appendix

### A. Relevant Files
| File | Deskripsi |
|------|-----------|
| `backend/src/app.module.ts` | Root module dengan middleware config |
| `backend/src/main.ts` | Bootstrap aplikasi NestJS |
| `backend/src/modules/chat/chat.controller.ts` | Controller untuk chat endpoints |
| `backend/src/modules/chat/chat.service.ts` | Business logic untuk chat |
| `backend/src/modules/chat/chat.gateway.ts` | WebSocket gateway |
| `backend/src/modules/chat/chat.module.ts` | Module definition |
| `frontend/src/hooks/use-chat.ts` | React hooks untuk chat API |
| `frontend/src/hooks/use-chat-socket.ts` | WebSocket hook |
| `frontend/src/components/chat/chat-window.tsx` | Chat UI component |
| `frontend/src/lib/api-client.ts` | HTTP client configuration |

### B. Commands Reference
```bash
# Rebuild backend
cd backend && npm run build

# Start backend
cd backend && npm run start:dev

# Run e2e tests
cd backend && npm run test:e2e

# Start frontend
cd frontend && npm run dev

# Run frontend tests
cd frontend && npm test
```

### C. Environment Variables
| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api` | Backend API URL |
| `PORT` | `3000` | Backend server port |
