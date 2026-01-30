# Chat E2E Testing dengan Playwright

## Setup

### 1. Install Dependencies
Playwright sudah diinstall. Untuk install browser drivers:

```bash
cd frontend
npx playwright install
```

### 2. Persiapan Testing

#### a. Pastikan Backend Berjalan
Sebelum menjalankan test, pastikan backend API sudah running:

```bash
cd backend
pnpm dev
```

Backend harus berjalan di `http://localhost:3000` (atau sesuai konfigurasi).

#### b. Setup Test Users
Test membutuhkan user dengan kredensial berikut:

- **Customer**: `customer@example.com` / `password123`
- **Merchant**: `merchant@example.com` / `password123`
- **Driver**: `driver@example.com` / `password123`

**User ini sudah otomatis dibuat jika Anda menjalankan seed database:**

**User ini sudah otomatis dibuat jika Anda menjalankan seed database:**

```bash
cd backend
pnpm prisma db seed
```

Atau jika ingin reset dan seed ulang:

```bash
cd backend
pnpm prisma migrate reset  # This will drop, recreate, and seed
```

Anda bisa membuat user ini melalui:
1. Registrasi manual di aplikasi
2. Seed database dengan data test
3. Update kredensial di `e2e/fixtures/test-helpers.ts`

#### c. Setup Test Data
Untuk test chat yang komprehensif, Anda perlu:
1. Orders yang sudah ada
2. Orders dengan status berbeda (PENDING, CONFIRMED, ON_DELIVERY, dll)
3. Chat rooms yang sudah ada (opsional, akan dibuat otomatis)

## Menjalankan Test

### Run All Tests
```bash
cd frontend
npx playwright test
```

### Run Chat Tests Only
```bash
npx playwright test chat.spec.ts
```

### Run dengan UI Mode (Recommended untuk Debug)
```bash
npx playwright test --ui
```

### Run dengan Browser Visible (Headed Mode)
```bash
npx playwright test --headed
```

### Run Specific Test
```bash
npx playwright test -g "should send a message in chat"
```

### Run dengan Debug Mode
```bash
npx playwright test --debug
```

## Melihat Test Report

Setelah test selesai:

```bash
npx playwright show-report
```

## Struktur Test

### File yang Dibuat:

1. **`playwright.config.ts`** - Konfigurasi Playwright
   - Setup browser (Chromium, Firefox, WebKit)
   - Dev server configuration
   - Screenshot dan video on failure
   - Base URL dan timeout settings

2. **`e2e/fixtures/test-helpers.ts`** - Helper functions dan fixtures
   - `login()` - Login helper
   - `logout()` - Logout helper
   - `createTestOrder()` - Create order untuk testing
   - `waitForSocketConnection()` - Wait untuk WebSocket connection
   - Test user credentials
   - Custom fixtures untuk multi-user testing

3. **`e2e/chat.spec.ts`** - Main chat E2E tests
   - Chat button visibility tests
   - Chat window open/close tests
   - Message sending tests
   - Enter key functionality
   - Empty message validation
   - Chat permissions based on order status
   - WebSocket connection tests
   - Chat history persistence tests
   - Error handling tests

## Test Coverage

Test mencakup:

✅ **Chat Button & Window**
- Display chat button pada order page
- Open chat window
- Close chat window

✅ **Message Functionality**
- Send message via button
- Send message via Enter key
- Prevent empty messages
- Message persistence

✅ **Permissions & Status**
- Chat availability berdasarkan order status
- Disabled state tooltips
- Customer-Merchant chat rules
- Customer-Driver chat rules

✅ **Real-time Features**
- WebSocket connection establishment
- Connection status indicators

✅ **History & Persistence**
- Load previous messages
- Reopen chat dengan history

✅ **Error Handling**
- Network error handling
- Offline mode behavior

## Debugging Tips

### 1. Test Gagal Karena Element Tidak Ditemukan

Jika test gagal mencari element:

```typescript
// Check element dengan multiple selectors
const element = page.locator('button:has-text("Chat"), [data-testid="chat-button"]');
```

Update selector di test sesuai dengan actual HTML element di aplikasi Anda.

### 2. Timeout Issues

Jika test timeout:
- Increase timeout di test specific:
  ```typescript
  await expect(element).toBeVisible({ timeout: 15000 });
  ```
- Atau update di `playwright.config.ts`

### 3. Check Screenshots

Saat test gagal, Playwright otomatis mengambil screenshot. Check di:
```
test-results/
```

### 4. Use Trace Viewer

Untuk detailed debugging:
```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### 5. Console Logs

Test sudah include console.log statements. Run dengan:
```bash
npx playwright test --reporter=line
```

## Menyesuaikan Test dengan Aplikasi Anda

### 1. Update Selectors

Jika element selectors berbeda, update di `chat.spec.ts`:

```typescript
// Contoh: Update chat button selector
const chatButton = page.locator('[data-testid="your-chat-button-id"]');
```

### 2. Update User Credentials

Edit `e2e/fixtures/test-helpers.ts`:

```typescript
export const testUsers: Record<string, TestUser> = {
  customer: {
    email: 'your-customer@email.com',
    password: 'your-password',
    role: 'customer',
  },
  // ...
};
```

### 3. Update Routes

Jika route berbeda, update di test:

```typescript
await page.goto('/your-orders-route');
```

### 4. Add Data Test IDs

Untuk selector yang lebih reliable, tambahkan `data-testid` di component Anda:

```tsx
// chat-button.tsx
<Button data-testid="chat-button-merchant" ...>
  Chat with Restaurant
</Button>

// chat-window.tsx
<div data-testid="chat-window" ...>
  ...
</div>
```

## Troubleshooting Common Issues

### Issue 1: "No orders found"
**Solusi**: Buat test orders terlebih dahulu atau gunakan existing orders di database test.

### Issue 2: "Login failed"
**Solusi**: 
- Verify user credentials ada di database
- Check login form selectors di `test-helpers.ts`
- Pastikan backend authentication working

### Issue 3: "Chat button disabled"
**Ini expected behavior**. Test akan skip test tersebut. Chat button disabled berdasarkan order status:
- Merchant chat disabled saat order ON_DELIVERY atau DELIVERED
- Driver chat disabled saat order bukan ON_DELIVERY

### Issue 4: "WebSocket not connecting"
**Solusi**:
- Verify socket.io server running di backend
- Check CORS configuration
- Verify socket URL di frontend configuration

### Issue 5: "Test too slow"
**Solusi**:
- Run test tanpa `--headed` mode
- Reduce `waitForTimeout` durations
- Use `page.waitForLoadState('networkidle')` dengan hati-hati

## CI/CD Integration

Untuk integrate dengan CI/CD:

```yaml
# .github/workflows/test.yml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npx playwright test
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Next Steps

1. **Expand Test Coverage**
   - Multi-user chat (customer dan merchant simultaneously)
   - Typing indicators
   - Read receipts
   - File attachments (if implemented)

2. **Add Visual Regression Tests**
   ```typescript
   await expect(page).toHaveScreenshot('chat-window.png');
   ```

3. **Performance Testing**
   - Measure message send latency
   - Check memory leaks di long chat sessions

4. **Accessibility Testing**
   ```typescript
   const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
   expect(accessibilityScanResults.violations).toEqual([]);
   ```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Test Selectors](https://playwright.dev/docs/selectors)

## Support

Jika menemukan issue atau error yang tidak tercakup di troubleshooting guide ini, check:
1. Browser console logs
2. Network tab untuk API errors
3. Playwright trace viewer untuk detailed execution flow
4. Backend logs untuk server-side errors
