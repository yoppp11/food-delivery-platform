// User types
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type Role = 'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  phoneNumber?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
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

// Merchant types
export interface Merchant {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  rating?: number | null;
  createdAt: Date;
  menus?: Menu[];
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

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  menus?: Menu[];
}

// Menu types
export interface Menu {
  id: string;
  merchantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  imageId?: string | null;
  createdAt: Date;
  merchant?: Merchant;
  category?: Category;
  image?: Image | null;
  variants?: MenuVariant[];
}

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
  menuId: string;
}

// Order types
export type OrderStatus = 'CREATED' | 'PAID' | 'PREPARING' | 'READY' | 'ON_DELIVERY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Order {
  id: string;
  userId: string;
  merchantId: string;
  driverId: string;
  status: OrderStatus;
  totalPrice: number;
  deliveryFee: number;
  paymentStatus: PaymentStatus;
  items?: OrderItem[];
  statusHistories?: OrderStatusHistory[];
  merchant?: Merchant;
  driver?: Driver;
  payments?: Payment[];
  deliveries?: Delivery[];
  promotions?: OrderPromotion[];
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
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  changedAt: Date;
  changedBy: string;
}

// Payment types
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

// Driver types
export interface Driver {
  id: string;
  userId: string;
  plateNumber: string;
  isAvailable: boolean;
  user?: User;
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

// Promotion types
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

// Review types
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
  user?: User;
}

// Notification types
export type NotificationType = 'ORDER' | 'Payment' | 'PROMO';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Image type
export interface Image {
  id: string;
  imageUrl: string;
  createdAt: Date;
}

// Cart types (frontend only)
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
