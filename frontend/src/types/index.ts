
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type Role = 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string | null;
  phoneNumber?: string | null;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  userProfiles?: UserProfile[];
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  imageId: string;
  birthDate: Date;
  createdAt: Date;
  image?: Image;
}

export interface UserAddress {
  id: string;
  userId: string;
  label: string;
  latitude: number;
  longitude: number;
  address: string;
  isDefault: boolean;
}

export interface Merchant {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  rating?: number | null;
  imageUrl?: string | null;
  reviewCount?: number;
  distance?: number | null;
  createdAt: Date;
  menus?: Menu[];
  merchantCategories?: MerchantMenuCategory[];
  operationalHours?: MerchantOperationalHour[];
  reviews?: MerchantReview[];
}

export interface MerchantOperationalHour {
  id: string;
  merchantId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  menus?: Menu[];
}

export interface MerchantMenuCategory {
  id: string;
  name: string;
  merchantId: string;
  menus?: Menu[];
  _count?: {
    menus: number;
  };
}

export interface Menu {
  id: string;
  merchantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageId?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  merchant?: Merchant;
  category?: MerchantMenuCategory;
  image?: Image | null;
  variants?: MenuVariant[];
  menuVariants?: MenuVariant[];
}

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
  menuId: string;
}

export type OrderStatus = 'CREATED' | 'PAID' | 'PREPARING' | 'READY' | 'ON_DELIVERY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Order {
  id: string;
  userId: string;
  merchantId: string;
  driverId?: string | null;
  status: OrderStatus;
  totalPrice: number;
  deliveryFee: number;
  paymentStatus: PaymentStatus;
  items?: OrderItem[];
  statusHistories?: OrderStatusHistory[];
  merchant?: Merchant;
  driver?: Driver | null;
  payments?: Payment[];
  deliveries?: Delivery[];
  promotions?: OrderPromotion[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuId: string;
  variantId: string;
  quantity: number;
  price: number;
  menu?: Menu;
  variant?: MenuVariant;
  menuVariant?: MenuVariant & { menu?: Menu };
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  changedAt: Date;
  changedBy: string;
}

export type Provider = 'MIDTRANS' | 'XENDIT';

export interface Payment {
  id: string;
  orderId: string;
  provider: Provider;
  paymentType: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
}

export interface PaymentCallback {
  id: string;
  paymentId: string;
  payload: unknown;
  receivedAt: Date;
}

export interface Driver {
  id: string;
  userId: string;
  plateNumber: string;
  isAvailable: boolean;
  rating?: number;
  user?: User;
  driverLocations?: DriverLocation[];
}

export interface DriverLocation {
  id: string;
  driverId: string;
  latitude: number;
  longitude: number;
  recordedAt: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  pickedAt: Date;
  deliveredAt: Date;
  distanceKm: number;
}

export type DiscountType = 'PERCENT' | 'FLAT';

export interface Promotion {
  id: string;
  code: string;
  discountType: DiscountType;
  maxDiscount: number;
  discountValue: number;
  expiredAt: Date;
}

export interface OrderPromotion {
  id: string;
  orderId: string;
  promotionId: string;
  discountAmount: number;
  promotion?: Promotion;
}

export interface MerchantReview {
  id: string;
  userId: string;
  merchantId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
}

export interface DriverReview {
  id: string;
  userId: string;
  driverId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
}

export type NotificationType = 'ORDER' | 'PAYMENT' | 'PROMO' | 'SYSTEM' | 'MESSAGE';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title?: string;
  body?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Image {
  id: string;
  imageUrl: string;
  createdAt: Date;
}

export type ChatRoomType = 'CUSTOMER_MERCHANT' | 'CUSTOMER_DRIVER' | 'CUSTOMER_SUPPORT';
export type ChatRole = 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'SUPPORT' | 'ADMIN';
export type MessageType = 'TEXT' | 'IMAGE' | 'LOCATION' | 'SYSTEM';
export type ChatRoomStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'ARCHIVED';
export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
export type SupportCategory = 'ORDER_ISSUE' | 'PAYMENT_ISSUE' | 'DELIVERY_ISSUE' | 'MERCHANT_COMPLAINT' | 'DRIVER_COMPLAINT' | 'REFUND_REQUEST' | 'GENERAL_INQUIRY' | 'TECHNICAL_ISSUE' | 'OTHER';
export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export interface ChatParticipant {
  id: string;
  chatRoomId: string;
  userId: string;
  role: ChatRole;
  joinedAt: Date;
  leftAt?: Date | null;
  lastSeenAt?: Date | null;
  lastReadAt?: Date | null;
  lastReadMsgId?: string | null;
  isMuted?: boolean;
  isBlocked?: boolean;
  user: Pick<User, 'id' | 'email' | 'image'>;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  isRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, unknown> | null;
  replyToId?: string | null;
  replyTo?: ChatMessage | null;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  sender?: Pick<User, 'id' | 'email' | 'image'>;
}

export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string | null;
  category: SupportCategory;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedToId?: string | null;
  resolvedAt?: Date | null;
  resolvedBy?: string | null;
  resolution?: string | null;
  createdAt: Date;
  updatedAt: Date;
  chatRoom?: ChatRoom;
  user?: Pick<User, 'id' | 'email' | 'image'>;
  assignedTo?: Pick<User, 'id' | 'email' | 'image'> | null;
}

export interface ChatRoom {
  id: string;
  orderId?: string | null;
  ticketId?: string | null;
  type: ChatRoomType;
  status: ChatRoomStatus;
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date | null;
  lastMessageId?: string | null;
  closedAt?: Date | null;
  closedReason?: string | null;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  order?: {
    id: string;
    status: string;
    merchantId?: string;
  } | null;
  ticket?: SupportTicket | null;
  isClosed?: boolean;
}

export interface CartItem {
  id: string;
  menu: Menu;
  variant?: MenuVariant;
  quantity: number;
}

export interface Cart {
  merchantId: string;
  merchant: Merchant;
  items: CartItem[];
}

export * from './driver';
