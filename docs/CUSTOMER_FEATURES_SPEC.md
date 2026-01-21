# Customer Features Specification Document

**Document Version:** 1.0  
**Created Date:** January 21, 2026  
**Project:** Food Delivery Platform  
**Module:** Customer Frontend & Backend Integration  

---

## Table of Contents

1. [Cart Page Data Retrieval Issue](#1-cart-page-data-retrieval-issue)
2. [Menu Variant Seeding Enhancement](#2-menu-variant-seeding-enhancement)
3. [Merchant Reviews Consistency](#3-merchant-reviews-consistency)
4. [Order Process Flow Alignment](#4-order-process-flow-alignment)
5. [Remove Mobile App Download Section](#5-remove-mobile-app-download-section)
6. [About Us Page Implementation](#6-about-us-page-implementation)
7. [Real-Time Chat System](#7-real-time-chat-system)
8. [Customer Profile Simplification](#8-customer-profile-simplification)
9. [Customer Address Management](#9-customer-address-management)

---

## 1. Cart Page Data Retrieval Issue

### Problem Description

The cart page on the customer side is unable to retrieve data from the backend. This prevents customers from viewing their cart items, modifying quantities, or proceeding to checkout.

### Technical Context

- **Frontend Location:** `frontend/src/pages/cart.tsx`
- **Backend Cart Module:** `backend/src/modules/cart/`
- **Related Hooks:** `frontend/src/hooks/use-cart.ts`
- **Database Schema:** `Cart` and `CartItem` tables in Prisma schema

### User Stories

#### US-1.1: View Cart Items
**As a** customer  
**I want to** view all items in my cart when I navigate to the cart page  
**So that** I can review what I'm about to order before checkout  

**Acceptance Criteria:**
- [ ] Cart page loads without errors when accessed
- [ ] All cart items are displayed with correct menu names
- [ ] Each item shows the variant name, base price, quantity, and item total
- [ ] Cart subtotal is calculated and displayed correctly
- [ ] Loading state is shown while fetching cart data
- [ ] Empty state is shown when cart has no items

#### US-1.2: Cart Data Persistence
**As a** customer  
**I want to** see my cart items persist across page refreshes and browser sessions  
**So that** I don't lose my selections when I leave and return to the site  

**Acceptance Criteria:**
- [ ] Cart items remain after page refresh
- [ ] Cart items are associated with the logged-in user
- [ ] Cart data is fetched from backend on page load
- [ ] Cart state syncs between frontend and backend

#### US-1.3: Add Items to Cart
**As a** customer  
**I want to** add menu items with variants to my cart from the restaurant detail page  
**So that** I can build my order before checkout  

**Acceptance Criteria:**
- [ ] "Add to Cart" button sends correct data to backend
- [ ] Cart is created if it doesn't exist for the merchant
- [ ] CartItem is created with correct variantId, basePrice, quantity, and itemTotal
- [ ] Cart subtotal is updated after adding items
- [ ] Success notification is shown after adding item
- [ ] Cart icon/badge updates to reflect new item count

#### US-1.4: Update Cart Item Quantity
**As a** customer  
**I want to** increase or decrease the quantity of items in my cart  
**So that** I can adjust my order without removing and re-adding items  

**Acceptance Criteria:**
- [ ] Quantity increment button increases quantity by 1
- [ ] Quantity decrement button decreases quantity by 1
- [ ] Quantity cannot go below 1 (use remove instead)
- [ ] Item total recalculates based on new quantity
- [ ] Cart subtotal updates accordingly
- [ ] Changes are persisted to the backend

#### US-1.5: Remove Cart Items
**As a** customer  
**I want to** remove items from my cart  
**So that** I can remove items I no longer want  

**Acceptance Criteria:**
- [ ] Remove button/icon is visible for each cart item
- [ ] Clicking remove deletes the item from the cart
- [ ] Cart subtotal updates after removal
- [ ] Confirmation dialog appears before removal (optional)
- [ ] Empty state is shown if last item is removed

#### US-1.6: Cart Notes
**As a** customer  
**I want to** add special instructions or notes to my cart and individual items  
**So that** the merchant knows my preferences  

**Acceptance Criteria:**
- [ ] Notes field is available for the overall cart
- [ ] Notes field is available for individual cart items
- [ ] Notes are saved to the backend
- [ ] Notes are displayed on the cart page

#### US-1.7: Single Merchant Cart Validation
**As a** customer  
**I want to** be notified if I try to add items from a different merchant  
**So that** I understand I can only order from one merchant at a time  

**Acceptance Criteria:**
- [ ] Warning/confirmation shown when adding from different merchant
- [ ] Option to clear current cart and start new one
- [ ] Option to cancel and keep current cart
- [ ] Cart status reflects single merchant constraint

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-1.1 | Cart API endpoint returns cart data with 200 status | Critical |
| SC-1.2 | Frontend successfully parses and displays cart response | Critical |
| SC-1.3 | Authentication token is properly included in cart requests | Critical |
| SC-1.4 | Cart CRUD operations work end-to-end | Critical |
| SC-1.5 | Error handling displays user-friendly messages | High |
| SC-1.6 | Cart state management is synchronized with backend | High |

### Technical Requirements

1. **API Endpoints Required:**
   - `GET /api/cart` - Retrieve user's active cart
   - `POST /api/cart` - Create new cart
   - `POST /api/cart/items` - Add item to cart
   - `PATCH /api/cart/items/:id` - Update cart item
   - `DELETE /api/cart/items/:id` - Remove cart item
   - `DELETE /api/cart/:id` - Clear entire cart

2. **Response Format Expected:**
```json
{
  "id": "uuid",
  "merchantId": "uuid",
  "userId": "uuid",
  "status": "ACTIVE",
  "subtotal": 50000,
  "notes": "string or null",
  "merchant": {
    "id": "uuid",
    "name": "Merchant Name"
  },
  "cartItems": [
    {
      "id": "uuid",
      "menuName": "Menu Name",
      "variantId": "uuid",
      "basePrice": 25000,
      "quantity": 2,
      "itemTotal": 50000,
      "notes": "string or null",
      "menuVariant": {
        "id": "uuid",
        "name": "Regular",
        "price": 25000
      }
    }
  ]
}
```

---

## 2. Menu Variant Seeding Enhancement

### Problem Description

Currently, the database seeding may create menus without associated menu variants. According to business logic, every menu must have at least one variant (e.g., "Regular" or "Normal") to be orderable. Menus without variants cannot be added to cart.

### Technical Context

- **Seed File Location:** `backend/prisma/seed.ts`
- **Menu Schema:** `Menu` model with `menuVariants` relation
- **MenuVariant Schema:** `MenuVariant` model linked to `Menu`

### User Stories

#### US-2.1: Default Menu Variant Creation
**As a** system administrator  
**I want** every seeded menu to have at least one default variant  
**So that** all menus are orderable and the platform functions correctly  

**Acceptance Criteria:**
- [ ] Every menu created during seeding has at least one MenuVariant
- [ ] Default variant is named "Regular" or "Normal"
- [ ] Default variant price matches the menu's base price
- [ ] No orphan menus exist without variants

#### US-2.2: Variant Price Consistency
**As a** system administrator  
**I want** variant prices to be logically consistent with menu prices  
**So that** pricing makes sense to customers  

**Acceptance Criteria:**
- [ ] Default "Regular" variant price equals menu base price
- [ ] Additional variants (if any) have appropriate price variations
- [ ] All prices are positive integers (in smallest currency unit)

#### US-2.3: Seed Data Validation
**As a** developer  
**I want** the seed script to validate data before insertion  
**So that** invalid data doesn't corrupt the database  

**Acceptance Criteria:**
- [ ] Seed script checks for required fields
- [ ] Seed script creates variants atomically with menus
- [ ] Error handling logs issues without crashing
- [ ] Seed can be run idempotently (multiple times without duplicates)

#### US-2.4: Multiple Variant Support
**As a** system administrator  
**I want** seeded menus to optionally have multiple variants  
**So that** the platform demonstrates realistic menu configurations  

**Acceptance Criteria:**
- [ ] Some menus have size variants (Small, Medium, Large)
- [ ] Some menus have type variants (Spicy, Non-Spicy)
- [ ] Variant prices differ appropriately
- [ ] All variants are linked to correct menu

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-2.1 | 100% of seeded menus have at least one variant | Critical |
| SC-2.2 | Seed script runs without errors | Critical |
| SC-2.3 | Variant names are user-friendly | Medium |
| SC-2.4 | Variant prices are realistic | Medium |

### Sample Seed Data Structure

```typescript
const menuWithVariants = {
  name: "Nasi Goreng Special",
  description: "Fried rice with egg and chicken",
  price: 25000, // Base price
  isAvailable: true,
  menuVariants: {
    create: [
      { name: "Regular", price: 25000 },
      { name: "Large", price: 35000 },
      { name: "Extra Spicy", price: 28000 }
    ]
  }
};
```

---

## 3. Merchant Reviews Consistency

### Problem Description

Merchant reviews displayed on the customer page do not match the actual data stored in the database. Ratings shown may be hardcoded or using mock data instead of fetching from the `MerchantReview` table.

### Technical Context

- **Frontend Component:** Restaurant detail page
- **Review Hook:** `frontend/src/hooks/use-reviews.ts`
- **Database Schema:** `MerchantReview` model
- **Merchant Rating Field:** `Merchant.rating` (Decimal, nullable)

### User Stories

#### US-3.1: Display Actual Reviews
**As a** customer  
**I want to** see real reviews from other customers on the merchant page  
**So that** I can make informed decisions about where to order  

**Acceptance Criteria:**
- [ ] Reviews are fetched from the backend API
- [ ] Each review shows the reviewer's name/avatar
- [ ] Each review shows the rating (1-5 stars)
- [ ] Each review shows the comment text
- [ ] Each review shows the date it was created
- [ ] Reviews are sorted by most recent first

#### US-3.2: Accurate Average Rating
**As a** customer  
**I want to** see the merchant's accurate average rating  
**So that** I can quickly assess the merchant's quality  

**Acceptance Criteria:**
- [ ] Average rating is calculated from all MerchantReview entries
- [ ] Average rating matches the `Merchant.rating` field
- [ ] Rating is displayed with one decimal place (e.g., 4.5)
- [ ] Total review count is displayed alongside rating
- [ ] Rating updates when new reviews are added

#### US-3.3: Rating Distribution
**As a** customer  
**I want to** see the distribution of ratings (how many 5-star, 4-star, etc.)  
**So that** I can understand the range of customer experiences  

**Acceptance Criteria:**
- [ ] Rating breakdown shows count for each star level
- [ ] Percentage or bar visualization for each rating level
- [ ] Distribution sums to total review count

#### US-3.4: Review Pagination
**As a** customer  
**I want to** load more reviews as I scroll  
**So that** I can see all reviews without overwhelming initial load  

**Acceptance Criteria:**
- [ ] Initial load shows 5-10 reviews
- [ ] "Load More" button or infinite scroll loads additional reviews
- [ ] Loading indicator shown while fetching more
- [ ] Message shown when all reviews are loaded

#### US-3.5: Review Filtering
**As a** customer  
**I want to** filter reviews by rating  
**So that** I can focus on specific feedback  

**Acceptance Criteria:**
- [ ] Filter options for each star rating (1-5)
- [ ] Filter for "All Reviews"
- [ ] Filtered results update immediately
- [ ] Count shown for each filter option

#### US-3.6: Submit New Review
**As a** customer who completed an order  
**I want to** submit a review for the merchant  
**So that** I can share my experience with others  

**Acceptance Criteria:**
- [ ] Review form only available after completing an order
- [ ] Rating selection (1-5 stars) is required
- [ ] Comment text field is required
- [ ] Review is saved to MerchantReview table
- [ ] Merchant's average rating is recalculated
- [ ] Success message shown after submission
- [ ] New review appears in review list

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-3.1 | Reviews displayed match MerchantReview table data | Critical |
| SC-3.2 | Average rating is dynamically calculated | Critical |
| SC-3.3 | No hardcoded or mock review data in production | Critical |
| SC-3.4 | Review API returns correct data structure | High |
| SC-3.5 | Rating updates after new review submission | High |

### API Endpoints Required

- `GET /api/merchants/:id/reviews` - Get reviews for a merchant
- `POST /api/merchants/:id/reviews` - Create new review
- `GET /api/merchants/:id/reviews/stats` - Get rating statistics

---

## 4. Order Process Flow Alignment

### Problem Description

The order process on the customer frontend does not properly follow the backend order flow. The order status transitions, payment integration, and user feedback may not align with the backend's order lifecycle defined by `OrderStatus` enum.

### Technical Context

- **Order Status Enum:** `CREATED → PAID → PREPARING → READY → ON_DELIVERY → COMPLETED`
- **Payment Status Enum:** `PENDING → SUCCESS → FAILED → CANCELLED → REFUNDED`
- **Order Hooks:** `frontend/src/hooks/use-orders.ts`
- **Checkout Page:** `frontend/src/pages/checkout.tsx`

### User Stories

#### US-4.1: Create Order from Cart
**As a** customer  
**I want to** create an order from my cart  
**So that** I can proceed to payment and receive my food  

**Acceptance Criteria:**
- [ ] "Checkout" button creates an order in CREATED status
- [ ] Order is created with all cart items as OrderItems
- [ ] Cart status changes to ORDER_CREATED
- [ ] Order ID is returned for tracking
- [ ] User is redirected to payment page

#### US-4.2: Select Delivery Address
**As a** customer  
**I want to** select or add a delivery address during checkout  
**So that** the driver knows where to deliver my order  

**Acceptance Criteria:**
- [ ] Saved addresses from UserAddres table are displayed
- [ ] User can select an existing address
- [ ] User can add a new address during checkout
- [ ] Selected address is associated with the order
- [ ] Delivery fee may be calculated based on distance

#### US-4.3: Payment Process
**As a** customer  
**I want to** complete payment for my order  
**So that** the merchant can start preparing my food  

**Acceptance Criteria:**
- [ ] Payment options are displayed (based on available providers)
- [ ] Payment is initiated with correct amount
- [ ] Payment status is tracked (PENDING → SUCCESS/FAILED)
- [ ] Order status updates to PAID upon successful payment
- [ ] OrderStatusHistory is created for status change
- [ ] Failure handling with retry option

#### US-4.4: Order Status Tracking
**As a** customer  
**I want to** track my order status in real-time  
**So that** I know when to expect my delivery  

**Acceptance Criteria:**
- [ ] Order detail page shows current status
- [ ] Status timeline/progress indicator is displayed
- [ ] Status updates are reflected (polling or WebSocket)
- [ ] Each status has clear user-friendly description
- [ ] Estimated time is shown where applicable

#### US-4.5: Order Confirmation
**As a** customer  
**I want to** receive confirmation when my order is placed  
**So that** I have assurance my order was received  

**Acceptance Criteria:**
- [ ] Confirmation page/modal shown after successful payment
- [ ] Order summary with items and totals displayed
- [ ] Order ID/number for reference
- [ ] Estimated delivery time
- [ ] Option to view order details

#### US-4.6: Order History
**As a** customer  
**I want to** view my past orders  
**So that** I can reorder or track previous purchases  

**Acceptance Criteria:**
- [ ] Order history page lists all user's orders
- [ ] Each order shows date, merchant, total, and status
- [ ] Orders sorted by most recent first
- [ ] Clicking order shows full details
- [ ] Option to reorder from past orders

#### US-4.7: Cancel Order
**As a** customer  
**I want to** cancel my order if it hasn't been prepared  
**So that** I can change my mind before the merchant starts cooking  

**Acceptance Criteria:**
- [ ] Cancel button available for orders in CREATED or PAID status
- [ ] Confirmation dialog before cancellation
- [ ] Order status changes to CANCELLED
- [ ] Payment is refunded if already paid
- [ ] OrderStatusHistory records cancellation
- [ ] Notification sent to merchant

#### US-4.8: Order Notifications
**As a** customer  
**I want to** receive notifications about my order status  
**So that** I'm informed of important updates  

**Acceptance Criteria:**
- [ ] Notification when order is confirmed
- [ ] Notification when payment is successful
- [ ] Notification when food is being prepared
- [ ] Notification when order is ready
- [ ] Notification when driver picks up order
- [ ] Notification when order is delivered

### Order Flow Diagram

```
[Cart ACTIVE] 
    ↓ Checkout
[Cart CHECKOUT]
    ↓ Create Order
[Order CREATED] → [Cart ORDER_CREATED]
    ↓ Payment
[Payment PENDING]
    ↓ Success
[Payment SUCCESS] → [Order PAID]
    ↓ Merchant accepts
[Order PREPARING]
    ↓ Food ready
[Order READY]
    ↓ Driver picks up
[Order ON_DELIVERY]
    ↓ Delivered
[Order COMPLETED]
```

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-4.1 | Order creation follows CREATED status | Critical |
| SC-4.2 | Payment success transitions order to PAID | Critical |
| SC-4.3 | Status transitions match OrderStatus enum | Critical |
| SC-4.4 | OrderStatusHistory is created for each change | High |
| SC-4.5 | Frontend displays correct status at each stage | High |
| SC-4.6 | Cancel and refund flow works correctly | High |

---

## 5. Remove Mobile App Download Section

### Problem Description

The customer-facing pages contain a section promoting Android and iOS app downloads. This section should be removed as there are no native mobile apps available.

### Technical Context

- **Potential Locations:**
  - Home page
  - Footer component
  - Landing page sections
- **Component Directory:** `frontend/src/components/`

### User Stories

#### US-5.1: Remove Download Section from Home
**As a** customer  
**I want** the home page to not show app download promotions  
**So that** I'm not confused about non-existent mobile apps  

**Acceptance Criteria:**
- [ ] No "Download on App Store" button visible
- [ ] No "Get it on Google Play" button visible
- [ ] No mobile phone mockup images promoting apps
- [ ] No QR codes for app download
- [ ] Page layout adjusts appropriately

#### US-5.2: Remove Download Section from Footer
**As a** customer  
**I want** the footer to not contain app download links  
**So that** the footer only shows relevant links  

**Acceptance Criteria:**
- [ ] Footer doesn't contain app store badges
- [ ] Footer doesn't mention mobile apps
- [ ] Footer links are still properly aligned

#### US-5.3: Remove App-Related Marketing Text
**As a** customer  
**I want** all app-related marketing copy removed  
**So that** there's no misleading information  

**Acceptance Criteria:**
- [ ] No "Download our app" text anywhere
- [ ] No "Available on mobile" messaging
- [ ] No "Coming soon to mobile" placeholders

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-5.1 | No app download UI elements visible | Critical |
| SC-5.2 | No broken layouts after removal | High |
| SC-5.3 | All pages checked for app references | Medium |

---

## 6. About Us Page Implementation

### Problem Description

The customer-facing frontend lacks an "About Us" page that provides information about the company, mission, and values.

### Technical Context

- **Pages Directory:** `frontend/src/pages/`
- **Router Configuration:** App routing setup
- **Layout Components:** `frontend/src/components/layout/`

### User Stories

#### US-6.1: Access About Us Page
**As a** customer  
**I want to** access an About Us page from the navigation  
**So that** I can learn about the company  

**Acceptance Criteria:**
- [ ] "About Us" link in header/footer navigation
- [ ] Page accessible at `/about` or `/about-us` route
- [ ] Page loads without errors
- [ ] Consistent layout with rest of site

#### US-6.2: View Company Information
**As a** customer  
**I want to** read about the company's background  
**So that** I understand who I'm ordering from  

**Acceptance Criteria:**
- [ ] Company name and logo displayed
- [ ] Brief company history or story
- [ ] Mission statement
- [ ] Vision statement
- [ ] Core values section

#### US-6.3: View Team Information
**As a** customer  
**I want to** see information about the team  
**So that** I feel connected to the people behind the platform  

**Acceptance Criteria:**
- [ ] Team section with key members (optional)
- [ ] Photos and brief bios (optional)
- [ ] Or general team description

#### US-6.4: Contact Information
**As a** customer  
**I want to** find contact information on the About page  
**So that** I know how to reach the company  

**Acceptance Criteria:**
- [ ] Email address for support
- [ ] Phone number (if available)
- [ ] Physical address (if applicable)
- [ ] Social media links

#### US-6.5: Responsive Design
**As a** customer using a mobile device  
**I want to** view the About Us page properly on my phone  
**So that** I have a good experience on any device  

**Acceptance Criteria:**
- [ ] Page is fully responsive
- [ ] Images scale appropriately
- [ ] Text is readable on small screens
- [ ] Navigation works on mobile

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-6.1 | About page is accessible and renders correctly | Critical |
| SC-6.2 | Navigation includes About Us link | High |
| SC-6.3 | Content is informative and professional | Medium |
| SC-6.4 | Page is responsive on all devices | High |

### Page Content Structure

```
/about-us
├── Hero Section
│   ├── Headline
│   └── Subheadline
├── Our Story Section
│   ├── Company background
│   └── Founding story
├── Mission & Vision Section
│   ├── Mission statement
│   └── Vision statement
├── Our Values Section
│   ├── Value 1 (e.g., Quality)
│   ├── Value 2 (e.g., Speed)
│   ├── Value 3 (e.g., Customer First)
│   └── Value 4 (e.g., Community)
├── Statistics Section (optional)
│   ├── Total orders delivered
│   ├── Partner merchants
│   └── Cities served
└── Contact Section
    ├── Email
    ├── Phone
    └── Social links
```

---

## 7. Real-Time Chat System

### Problem Description

The platform lacks a communication system that allows real-time messaging between:
- Customer and Merchant
- Customer and Driver
- Customer and Admin (Support)

### Technical Context

- **Frontend:** React with potential WebSocket/Socket.io integration
- **Backend:** NestJS with WebSocket gateway
- **Database:** May need new Chat/Message models in Prisma schema

### User Stories

#### US-7.1: Customer-Merchant Chat
**As a** customer  
**I want to** chat with the merchant about my order  
**So that** I can ask questions or provide special instructions  

**Acceptance Criteria:**
- [ ] Chat button available on order detail page
- [ ] Chat only available for active orders
- [ ] Real-time message sending and receiving
- [ ] Message history preserved
- [ ] Read receipts (optional)
- [ ] Notification for new messages

#### US-7.2: Customer-Driver Chat
**As a** customer  
**I want to** chat with my delivery driver  
**So that** I can provide directions or coordinate delivery  

**Acceptance Criteria:**
- [ ] Chat button available when order is ON_DELIVERY status
- [ ] Real-time communication
- [ ] Driver can send location updates
- [ ] Quick response templates (e.g., "On my way", "Arrived")
- [ ] Chat closes when order is delivered

#### US-7.3: Customer-Admin Support Chat
**As a** customer  
**I want to** chat with customer support  
**So that** I can get help with issues or complaints  

**Acceptance Criteria:**
- [ ] Support chat accessible from help/profile page
- [ ] Available regardless of order status
- [ ] Support agent assignment
- [ ] Ticket/conversation history
- [ ] Option to attach images (for complaints)
- [ ] Working hours indication

#### US-7.4: Real-Time Message Delivery
**As a** customer  
**I want to** receive messages instantly without refreshing  
**So that** communication is seamless  

**Acceptance Criteria:**
- [ ] WebSocket connection established on chat open
- [ ] Messages appear instantly for both parties
- [ ] Connection status indicator
- [ ] Reconnection handling on network issues
- [ ] Offline message queuing

#### US-7.5: Message Notifications
**As a** customer  
**I want to** be notified of new messages  
**So that** I don't miss important communications  

**Acceptance Criteria:**
- [ ] In-app notification for new messages
- [ ] Unread message count badge
- [ ] Push notification (if browser supports)
- [ ] Sound notification (optional, toggleable)

#### US-7.6: Chat History
**As a** customer  
**I want to** view previous chat conversations  
**So that** I can reference past discussions  

**Acceptance Criteria:**
- [ ] Chat history accessible from order details
- [ ] Messages sorted chronologically
- [ ] Timestamps on messages
- [ ] Scroll to load older messages

#### US-7.7: Message Types
**As a** customer  
**I want to** send different types of messages  
**So that** I can communicate effectively  

**Acceptance Criteria:**
- [ ] Text messages supported
- [ ] Image attachments (optional)
- [ ] Location sharing (for driver chat)
- [ ] Emoji support

### Technical Requirements

#### New Database Models Required

```prisma
model ChatRoom {
  id            String       @id @default(uuid())
  orderId       String?
  type          ChatRoomType
  createdAt     DateTime     @default(now())
  
  order         Order?       @relation(fields: [orderId], references: [id])
  participants  ChatParticipant[]
  messages      ChatMessage[]
  
  @@map("chatRooms")
}

model ChatParticipant {
  id         String   @id @default(uuid())
  chatRoomId String
  userId     String
  role       ChatRole
  joinedAt   DateTime @default(now())
  
  chatRoom   ChatRoom @relation(fields: [chatRoomId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
  
  @@map("chatParticipants")
}

model ChatMessage {
  id         String      @id @default(uuid())
  chatRoomId String
  senderId   String
  content    String
  type       MessageType @default(TEXT)
  isRead     Boolean     @default(false)
  createdAt  DateTime    @default(now())
  
  chatRoom   ChatRoom    @relation(fields: [chatRoomId], references: [id])
  sender     User        @relation(fields: [senderId], references: [id])
  
  @@map("chatMessages")
}

enum ChatRoomType {
  CUSTOMER_MERCHANT
  CUSTOMER_DRIVER
  CUSTOMER_SUPPORT
}

enum ChatRole {
  CUSTOMER
  MERCHANT
  DRIVER
  ADMIN
}

enum MessageType {
  TEXT
  IMAGE
  LOCATION
  SYSTEM
}
```

#### WebSocket Events

```typescript
// Client → Server
'chat:join'        // Join a chat room
'chat:leave'       // Leave a chat room
'chat:message'     // Send a message
'chat:typing'      // Typing indicator

// Server → Client
'chat:message'     // Receive a message
'chat:typing'      // Typing indicator
'chat:read'        // Message read receipt
'chat:error'       // Error notification
```

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-7.1 | WebSocket connection is stable | Critical |
| SC-7.2 | Messages delivered in real-time (< 1 second) | Critical |
| SC-7.3 | Chat history persisted in database | Critical |
| SC-7.4 | Chat rooms properly scoped to order context | High |
| SC-7.5 | Notifications work correctly | High |
| SC-7.6 | Chat UI is intuitive and responsive | High |

---

## 8. Customer Profile Simplification

### Problem Description

The customer profile page contains sections that should be removed:
1. Payment Method section (not applicable)
2. Statistical data (total orders, reviews, favorites)

The profile should be simplified to show only essential user information.

### Technical Context

- **Profile Page:** `frontend/src/pages/profile.tsx`
- **Profile Components:** Profile-related components in `frontend/src/components/`

### User Stories

#### US-8.1: Remove Payment Method Section
**As a** customer  
**I want** the profile page to not show payment method management  
**So that** I'm not confused by irrelevant options  

**Acceptance Criteria:**
- [ ] No "Payment Methods" section visible
- [ ] No "Add Payment Method" button
- [ ] No saved cards display
- [ ] No payment-related settings

#### US-8.2: Remove Statistics Display
**As a** customer  
**I want** the profile page to focus on my information  
**So that** I see only relevant account details  

**Acceptance Criteria:**
- [ ] No "Total Orders" statistic displayed
- [ ] No "Reviews Given" count displayed
- [ ] No "Favorites" count displayed
- [ ] No statistics cards or widgets

#### US-8.3: Essential Profile Information
**As a** customer  
**I want to** see and edit my essential profile information  
**So that** my account details are accurate  

**Acceptance Criteria:**
- [ ] Display user's email
- [ ] Display user's phone number (if set)
- [ ] Display user's profile image
- [ ] Option to edit profile details
- [ ] Link to manage addresses

#### US-8.4: Profile Navigation
**As a** customer  
**I want** clear navigation within profile settings  
**So that** I can find what I need  

**Acceptance Criteria:**
- [ ] Link to Address Management
- [ ] Link to Order History
- [ ] Link to Notification Settings
- [ ] Link to Account Security (password change)
- [ ] Logout option

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-8.1 | Payment methods section completely removed | Critical |
| SC-8.2 | Statistics widgets/cards removed | Critical |
| SC-8.3 | Profile page layout is clean and functional | High |
| SC-8.4 | Essential information is still accessible | High |

### Profile Page Structure (After Changes)

```
Profile Page
├── Profile Header
│   ├── Profile Image
│   ├── User Name/Email
│   └── Edit Profile Button
├── Account Information
│   ├── Email
│   ├── Phone Number
│   └── Member Since
├── Quick Links
│   ├── My Addresses →
│   ├── Order History →
│   ├── Notifications Settings →
│   └── Security Settings →
└── Logout Button
```

---

## 9. Customer Address Management

### Problem Description

Customer addresses should be properly managed according to the `UserAddres` schema and used as delivery addresses during order placement.

### Technical Context

- **Database Schema:** `UserAddres` model
- **Address Fields:** `label`, `latitude`, `longitude`, `address`, `isDefault`
- **Hooks:** `frontend/src/hooks/use-addresses.ts`

### User Stories

#### US-9.1: View Saved Addresses
**As a** customer  
**I want to** view all my saved addresses  
**So that** I can manage my delivery locations  

**Acceptance Criteria:**
- [ ] Address list page accessible from profile
- [ ] Each address shows label (Home, Work, etc.)
- [ ] Each address shows full address text
- [ ] Default address is clearly indicated
- [ ] Empty state shown if no addresses

#### US-9.2: Add New Address
**As a** customer  
**I want to** add a new delivery address  
**So that** I can have food delivered to different locations  

**Acceptance Criteria:**
- [ ] "Add Address" button available
- [ ] Form includes label field (Home, Work, Custom)
- [ ] Form includes address text field
- [ ] Map picker for selecting location (latitude/longitude)
- [ ] Option to set as default address
- [ ] Address saved to UserAddres table
- [ ] Validation for required fields

#### US-9.3: Edit Address
**As a** customer  
**I want to** edit an existing address  
**So that** I can update incorrect information  

**Acceptance Criteria:**
- [ ] Edit button on each address card
- [ ] Form pre-populated with current values
- [ ] All fields editable
- [ ] Changes saved to database
- [ ] Success confirmation shown

#### US-9.4: Delete Address
**As a** customer  
**I want to** delete addresses I no longer need  
**So that** my address list stays clean  

**Acceptance Criteria:**
- [ ] Delete button on each address card
- [ ] Confirmation dialog before deletion
- [ ] Cannot delete default address (must set another first)
- [ ] Address removed from database
- [ ] List updates after deletion

#### US-9.5: Set Default Address
**As a** customer  
**I want to** set a default delivery address  
**So that** checkout is faster  

**Acceptance Criteria:**
- [ ] "Set as Default" option for each address
- [ ] Only one address can be default
- [ ] Previous default is unset automatically
- [ ] Default address pre-selected during checkout
- [ ] isDefault field updated in database

#### US-9.6: Use Address During Checkout
**As a** customer  
**I want to** select a delivery address during checkout  
**So that** my order is delivered to the right place  

**Acceptance Criteria:**
- [ ] Address selection step in checkout flow
- [ ] Saved addresses displayed as options
- [ ] Default address pre-selected
- [ ] Option to add new address during checkout
- [ ] Selected address shown in order confirmation
- [ ] Address coordinates used for delivery

#### US-9.7: Location Search
**As a** customer  
**I want to** search for an address using text  
**So that** I can easily find my location  

**Acceptance Criteria:**
- [ ] Search input field in add address form
- [ ] Autocomplete suggestions from geocoding service
- [ ] Selecting suggestion fills in address and coordinates
- [ ] Map updates to show selected location
- [ ] Manual pin adjustment allowed

#### US-9.8: Current Location
**As a** customer  
**I want to** use my current location as delivery address  
**So that** I don't have to manually enter it  

**Acceptance Criteria:**
- [ ] "Use Current Location" button
- [ ] Browser geolocation permission request
- [ ] Map centers on current location
- [ ] Reverse geocoding to get address text
- [ ] User can adjust pin if needed

### Success Criteria

| ID | Criteria | Priority |
|----|----------|----------|
| SC-9.1 | Addresses stored in UserAddres table correctly | Critical |
| SC-9.2 | Address CRUD operations work end-to-end | Critical |
| SC-9.3 | Checkout uses saved addresses | Critical |
| SC-9.4 | Latitude/longitude captured for all addresses | Critical |
| SC-9.5 | Default address logic works correctly | High |
| SC-9.6 | Map integration for location picking | High |

### API Endpoints Required

```
GET    /api/user/addresses        - List user's addresses
POST   /api/user/addresses        - Create new address
PATCH  /api/user/addresses/:id    - Update address
DELETE /api/user/addresses/:id    - Delete address
PATCH  /api/user/addresses/:id/default - Set as default
```

### Address Data Structure

```typescript
interface UserAddress {
  id: string;
  userId: string;
  label: string;         // "Home", "Work", "Apartment", etc.
  latitude: number;      // Decimal
  longitude: number;     // Decimal
  address: string;       // Full address text
  isDefault: boolean;
}
```

---

## Implementation Priority Matrix

| Feature | Priority | Complexity | Dependencies |
|---------|----------|------------|--------------|
| Cart Data Retrieval | P0 - Critical | Medium | Backend API |
| Order Process Flow | P0 - Critical | High | Cart, Payment |
| Menu Variant Seeding | P0 - Critical | Low | Database |
| Customer Addresses | P1 - High | Medium | Checkout |
| Merchant Reviews | P1 - High | Medium | Database |
| Profile Simplification | P2 - Medium | Low | None |
| Remove Download Section | P2 - Medium | Low | None |
| About Us Page | P3 - Low | Low | None |
| Real-Time Chat | P3 - Low | High | WebSocket, DB Schema |

---

## Testing Requirements

### Unit Tests
- Cart state management
- Address validation
- Order status transitions
- Review calculations

### Integration Tests
- Cart API endpoints
- Address CRUD operations
- Order creation flow
- WebSocket chat messages

### End-to-End Tests
- Complete order flow from cart to delivery
- Address management workflow
- Chat conversation flow

---

## Appendix

### Related Documentation
- [API Reference](../backend/API_REFERENCE.md)
- [Database Schema](../backend/prisma/schema.prisma)
- [Redis Caching Spec](./REDIS_CACHING_DOCKER_TESTING_SPEC.md)

### Glossary
- **Cart**: Temporary storage of items before order placement
- **MenuVariant**: Size/type option for a menu item
- **UserAddres**: Customer's saved delivery location (note: typo in schema)
- **OrderStatus**: Enum defining order lifecycle states

---

*Document maintained by Development Team*  
*Last updated: January 21, 2026*
