import type {
  User,
  Merchant,
  Menu,
  MerchantMenuCategory,
  MerchantOperationalHour,
  MerchantReview,
  MenuVariant,
  OrderStatus,
  PaymentStatus,
  Image,
} from './index';
import type { ApprovalStatus } from './driver';

export interface MerchantWithApproval extends Merchant {
  approvalStatus?: ApprovalStatus;
}

export interface MerchantOrder {
  id: string;
  userId: string;
  merchantId: string;
  driverId: string | null;
  status: OrderStatus;
  totalPrice: number;
  deliveryFee: number | null;
  paymentStatus: PaymentStatus;
  createdAt?: Date;
  items?: MerchantOrderItem[];
  statusHistories?: MerchantOrderStatusHistory[];
  merchant?: Merchant;
  user?: { id: string; name?: string; image: string | null };
}

export interface MerchantOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  menuVariant?: {
    id: string;
    name: string;
    price: number;
    menu?: Menu;
  };
}

export interface MerchantOrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  changedAt: Date;
  changedBy: string;
}

export interface MerchantOrderListResponse {
  data: MerchantOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MerchantStats {
  pendingOrders: number;
  completedToday: number;
  todayRevenue: number;
  averageRating: number | null;
}

export interface UpdateMerchantRequest {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
}

export interface CreateOperationalHourRequest {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface UpdateOperationalHourRequest {
  dayOfWeek?: number;
  openTime?: string;
  closeTime?: string;
}

export interface CreateMenuRequest {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  image?: File;
  menuVariants?: Array<{
    name: string;
    price: number;
  }>;
}

export interface UpdateMenuRequest {
  name?: string;
  description?: string;
  price?: number;
  isAvailable?: boolean;
  imageId?: string;
  categoryId?: string;
  menuVariants?: Array<{
    id?: string;
    name: string;
    price: number;
  }>;
}

export interface MenuApiResponse {
  data: Menu[];
  total: number;
  page: number;
  limit: number;
}

export interface DeleteMenuResponse {
  data: Menu;
  message: string;
}

export interface CreateCategoryRequest {
  name: string;
  merchantId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export interface ReviewListResponse {
  data: MerchantReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type {
  User,
  Merchant,
  Menu,
  MerchantMenuCategory,
  MerchantOperationalHour,
  MerchantReview,
  MenuVariant,
  OrderStatus,
  PaymentStatus,
  Image,
};

export const DAYS_OF_WEEK: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus | 'REFUNDED', string> = {
  CREATED: 'bg-gray-500',
  PAID: 'bg-yellow-500',
  PREPARING: 'bg-blue-500',
  READY: 'bg-purple-500',
  ON_DELIVERY: 'bg-indigo-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  REFUNDED: 'bg-orange-500',
};
