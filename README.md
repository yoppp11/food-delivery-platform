# Food Delivery Platform 🍔

A comprehensive full-stack food delivery platform with multi-role support for customers, merchants, drivers, and administrators.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Test Accounts](#-test-accounts)
- [Application Routes](#-application-routes)
- [Features by Role](#-features-by-role)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-delivery-platform
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start with Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```
   
   This starts:
   - Backend API: http://localhost:3001
   - Frontend: http://localhost:80
   - PostgreSQL: localhost:5432
   - Redis Cache: localhost:6379
   - Redis Queue: localhost:6380

4. **Access the application**
   - Customer Frontend: http://localhost
   - API Health Check: http://localhost:3001/api/health

### Manual Setup (Development)

```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Backend
cd backend
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed  # Seeds test data
pnpm run dev

# Frontend (new terminal)
cd frontend
pnpm install
pnpm run dev
```

---

## 🔐 Test Accounts

Use these pre-seeded accounts to test the application:

### Customer Account
- **Email:** `customer@example.com`
- **Password:** `password123`
- **Access:** http://localhost/login
- **Features:** Browse restaurants, place orders, track deliveries, manage profile

### Merchant Account
- **Email:** `merchant@example.com`
- **Password:** `password123`
- **Access:** http://localhost/merchant/login
- **Features:** Manage menus, process orders, view analytics, handle reviews

### Second Merchant Account
- **Email:** `merchant2@example.com`
- **Password:** `password123`
- **Access:** http://localhost/merchant/login
- **Merchant:** Sushi Express (Japanese restaurant)

### Driver Account
- **Email:** `driver@example.com`
- **Password:** `password123`
- **Access:** http://localhost/driver/login
- **Features:** Accept deliveries, track earnings, manage availability, navigate to customers

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `password123`
- **Access:** http://localhost/admin
- **Features:** Manage all users, approve merchants/drivers, view reports, system oversight

---

## 🗺️ Application Routes

### Customer Routes (Role: CUSTOMER)

All customer routes require login at `/login`

| Route | Description |
|-------|-------------|
| `/` | Home page - Browse featured restaurants |
| `/restaurants` | List all available restaurants |
| `/restaurants/:id` | Restaurant detail with menu |
| `/cart` | Shopping cart management |
| `/checkout` | Order checkout and payment |
| `/orders` | Order history and tracking |
| `/orders/:id` | Detailed order status and tracking |
| `/profile` | User profile and settings |
| `/notifications` | Order and system notifications |
| `/about` | About us page (public) |

### Merchant Routes (Role: MERCHANT)

Login at `/merchant/login` or register at `/merchant/register`

| Route | Description |
|-------|-------------|
| `/merchant` | Dashboard with sales analytics |
| `/merchant/select` | Select/switch merchant (if multiple) |
| `/merchant/orders` | Incoming and active orders |
| `/merchant/orders/:id` | Order details and status management |
| `/merchant/menus` | Menu item management |
| `/merchant/menus/new` | Add new menu item |
| `/merchant/menus/:id/edit` | Edit existing menu item |
| `/merchant/categories` | Menu category management |
| `/merchant/settings` | Restaurant settings and hours |
| `/merchant/reviews` | Customer reviews and ratings |
| `/merchant/notifications` | Order and system notifications |

### Driver Routes (Role: DRIVER)

Login at `/driver/login` or register at `/driver/register`

| Route | Description |
|-------|-------------|
| `/driver` | Dashboard with available deliveries |
| `/driver/orders` | Active delivery assignments |
| `/driver/history` | Delivery history |
| `/driver/earnings` | Earnings and statistics |
| `/driver/reviews` | Customer ratings and feedback |
| `/driver/profile` | Driver profile and vehicle info |
| `/driver/notifications` | Delivery notifications |

### Admin Routes (Role: ADMIN)

Login with admin credentials at `/admin`

| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard with platform stats |
| `/admin/users` | User management |
| `/admin/users/:id` | User details and moderation |
| `/admin/merchants` | Merchant approval and management |
| `/admin/merchants/:id` | Merchant details and verification |
| `/admin/drivers` | Driver approval and management |
| `/admin/orders` | All platform orders |
| `/admin/orders/:id` | Order details and resolution |
| `/admin/promotions` | Promotion code management |
| `/admin/promotions/new` | Create new promotions |
| `/admin/categories` | Global category management |
| `/admin/reports` | Platform analytics and reports |

---

## ✨ Features by Role

### 👤 Customer Features

**Order Management**
- Browse restaurants with filters (cuisine, rating, distance)
- View detailed menus with variants (sizes, options)
- Add items to cart with special instructions
- Place orders with delivery address selection
- Real-time order status tracking
- Order history with reorder capability

**User Experience**
- Location-based restaurant discovery
- Save multiple delivery addresses
- Rating and reviewing restaurants
- Notification system for order updates
- Profile management
- Order chat with merchants and drivers

**Payment**
- Multiple payment provider support (Midtrans, Xendit, Pakasir)
- Secure payment processing
- Order receipt and invoice

### 🏪 Merchant Features

**Restaurant Management**
- Dashboard with sales analytics
- Operating hours configuration
- Restaurant profile and settings
- Approval status tracking

**Menu Management**
- Create, edit, and delete menu items
- Menu variants (sizes, options)
- Category organization
- Availability toggle
- Image upload for menu items
- Pricing management

**Order Processing**
- Real-time order notifications
- Accept/reject orders
- Update order status (Preparing, Ready)
- Order history and analytics
- Customer communication via chat

**Business Intelligence**
- Sales reports and trends
- Popular items analytics
- Customer review management
- Performance metrics

### 🚗 Driver Features

**Delivery Management**
- Available delivery queue
- Accept/reject deliveries
- Navigation to restaurant and customer
- Update delivery status
- Delivery completion confirmation

**Earnings & Performance**
- Earnings tracker
- Delivery history
- Performance metrics
- Customer ratings and feedback
- Availability toggle

**Communication**
- Chat with customers
- Order details and special instructions
- Location sharing

### 👨‍💼 Admin Features

**Platform Management**
- Comprehensive dashboard with KPIs
- User management (customers, merchants, drivers)
- Merchant approval workflow
- Driver verification and approval
- Account suspension/activation

**Order Oversight**
- View all platform orders
- Order dispute resolution
- Refund processing
- Status management

**Business Tools**
- Promotion code creation and management
- Global category management
- Platform-wide reports and analytics
- Revenue tracking

**System Administration**
- User role management
- Platform configuration
- Notification management
- Data export capabilities

---

## 🛠️ Technology Stack

### Backend

- **Framework:** NestJS (Node.js TypeScript framework)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 7.1.0
- **Authentication:** Better Auth with email/password
- **Real-time:** Socket.io for WebSocket communication
- **Caching:** Redis (with ioredis)
- **Queue:** BullMQ with Redis
- **File Upload:** Cloudinary integration
- **Payment:** Pakasir SDK (multi-provider support)
- **API Documentation:** Swagger/OpenAPI
- **Validation:** Zod with Prisma type generation

### Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **State Management:** TanStack Query (React Query)
- **UI Components:** Radix UI primitives
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form
- **Maps:** Leaflet & React Leaflet
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Real-time:** Socket.io Client
- **Internationalization:** i18next

### Infrastructure

- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (for frontend static files)
- **Process Manager:** PM2 (production)
- **Database Migrations:** Prisma Migrate
- **Reverse Proxy:** Nginx (for API proxying)

### Development Tools

- **Package Manager:** pnpm
- **Code Quality:** ESLint, Prettier
- **Testing:** Vitest, React Testing Library
- **Type Safety:** TypeScript 5.9+
- **API Testing:** Swagger UI, Prisma Studio

---

## 📁 Project Structure

```
food-delivery-platform/
├── backend/                # NestJS backend application
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   │   ├── address/   # User address management
│   │   │   ├── admin/     # Admin functionality
│   │   │   ├── cart/      # Shopping cart
│   │   │   ├── category/  # Menu categories
│   │   │   ├── chat/      # Real-time messaging
│   │   │   ├── delivery/  # Delivery management
│   │   │   ├── driver/    # Driver operations
│   │   │   ├── menu/      # Menu management
│   │   │   ├── merchant/  # Merchant operations
│   │   │   ├── notification/ # Notifications
│   │   │   ├── order/     # Order processing
│   │   │   ├── payment/   # Payment integration
│   │   │   ├── promotion/ # Promo codes
│   │   │   ├── queue/     # Background jobs
│   │   │   ├── review/    # Ratings & reviews
│   │   │   ├── upload/    # File uploads
│   │   │   └── user/      # User management
│   │   ├── common/        # Shared utilities
│   │   ├── config/        # Configuration
│   │   └── main.ts        # Application entry
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── migrations/    # Database migrations
│   │   ├── seed.ts        # Seed data
│   │   └── prisma.config.ts # Prisma v7 config
│   ├── Dockerfile         # Backend container
│   └── package.json
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   │   ├── index.tsx # Customer pages
│   │   │   ├── merchant/ # Merchant dashboard
│   │   │   ├── driver/   # Driver dashboard
│   │   │   └── admin/    # Admin panel
│   │   ├── providers/    # Context providers
│   │   ├── lib/          # Utilities
│   │   └── App.tsx       # Main app component
│   ├── Dockerfile        # Frontend container
│   ├── nginx.conf        # Nginx configuration
│   └── package.json
├── docs/                 # Documentation
│   ├── CUSTOMER_FEATURES_SPEC.md
│   └── REDIS_CACHING_DOCKER_TESTING_SPEC.md
├── docker-compose.yml    # Production setup
├── docker-compose.dev.yml # Development setup
├── DEPLOYMENT.md         # Deployment guide
└── .env.example          # Environment variables template
```

---

## 📚 API Documentation

### Interactive API Documentation

Once the backend is running, access the Swagger documentation:

**URL:** http://localhost:3001/api/docs

### Authentication

All authenticated endpoints require a session cookie from Better Auth.

**Sign Up:**
```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Sign In:**
```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

The session cookie is automatically set and used for subsequent requests.

### Key API Endpoints

**Merchants**
- `GET /api/merchants` - List all merchants
- `GET /api/merchants/:id` - Get merchant details
- `POST /api/merchants` - Create merchant (MERCHANT role)
- `PATCH /api/merchants/:id` - Update merchant

**Menus**
- `GET /api/menus` - List menus
- `GET /api/merchants/:merchantId/menus` - Get merchant menus
- `POST /api/menus` - Create menu item
- `PATCH /api/menus/:id` - Update menu item

**Cart**
- `GET /api/cart` - Get user's active cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

**Orders**
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

**Payments**
- `POST /api/payments` - Create payment
- `POST /api/payments/callback` - Payment webhook

**Reviews**
- `GET /api/merchants/:id/reviews` - Get merchant reviews
- `POST /api/reviews/merchant` - Create merchant review
- `POST /api/reviews/driver` - Create driver review

For complete API reference, see [backend/API_REFERENCE.md](backend/API_REFERENCE.md)

---

## 💻 Development

### Running Tests

```bash
# Backend tests
cd backend
pnpm test
pnpm test:e2e
pnpm test:cov

# Frontend tests
cd frontend
pnpm test
pnpm test:ui
pnpm test:coverage
```

### Database Management

```bash
# Create migration
cd backend
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Seed database
pnpm prisma db seed

# Reset database (dev only)
pnpm prisma migrate reset

# Open Prisma Studio
pnpm prisma studio
```

### Code Quality

```bash
# Backend linting
cd backend
pnpm lint
pnpm format

# Frontend linting
cd frontend
pnpm lint
```

### Environment Variables

#### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/food_delivery"

# Authentication
BETTER_AUTH_SECRET="your-secret-32-chars-minimum"
BETTER_AUTH_URL="http://localhost:3001"

# Redis
REDIS_CACHE_HOST="localhost"
REDIS_CACHE_PORT=6379
REDIS_QUEUE_HOST="localhost"
REDIS_QUEUE_PORT=6379

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Environment
NODE_ENV="development"
PORT=3001
```

#### Frontend (.env)

```env
VITE_API_URL="http://localhost:3001"
VITE_WEBSOCKET_URL="http://localhost:3001"
```

---

## 🚀 Deployment

For comprehensive deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy with Docker

1. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. Build and start services
   ```bash
   docker-compose up -d --build
   ```

3. Run database migrations
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

4. Seed initial data (optional)
   ```bash
   docker-compose exec backend npx prisma db seed
   ```

### Services

- **Frontend:** http://localhost (port 80)
- **Backend API:** http://localhost:3001
- **Database:** PostgreSQL on port 5432
- **Redis Cache:** port 6379
- **Redis Queue:** port 6380

### Production Checklist

- [ ] Set strong `BETTER_AUTH_SECRET`
- [ ] Configure Cloudinary credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up CDN for static assets
- [ ] Enable rate limiting
- [ ] Configure payment provider webhooks
- [ ] Set up email notifications (optional)

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://react.dev/) - UI library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Better Auth](https://better-auth.com/) - Authentication library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation in `/docs`
- Review API Reference: `backend/API_REFERENCE.md`
- Review Setup Guide: `backend/SETUP_GUIDE.md`

---

**Made with ❤️ for food delivery**
