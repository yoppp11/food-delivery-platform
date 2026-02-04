import type { User, Merchant, PaymentStatus } from './index';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Driver {
  id: string;
  userId: string;
  plateNumber: string;
  isAvailable: boolean;
  rating?: number;
  approvalStatus?: ApprovalStatus;
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

export interface DriverEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalDeliveries: number;
}

export interface EarningsHistoryItem {
  id: string;
  orderId: string;
  merchantName: string;
  distanceKm: number;
  earnings: number;
  deliveredAt: Date;
}

export interface EarningsHistoryResponse {
  data: EarningsHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AvailableOrder {
  id: string;
  userId: string;
  merchantId: string;
  status: 'READY';
  totalPrice: number;
  deliveryFee: number | null;
  paymentStatus: PaymentStatus;
  merchant: {
    id: string;
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
  };
  user: {
    id: string;
    image: string | null;
  };
  distance: number;
}

export interface ActiveOrder {
  id: string;
  userId: string;
  merchantId: string;
  driverId: string;
  status: 'ON_DELIVERY';
  totalPrice: number;
  deliveryFee: number;
  paymentStatus: PaymentStatus;
  merchant: Merchant;
  items: {
    id: string;
    orderId: string;
    variantId: string;
    quantity: number;
    price: number;
    menuVariant: {
      id: string;
      name: string;
      price: number;
      menu: {
        id: string;
        name: string;
        description: string;
      };
    };
  }[];
}

export interface DeliveryHistoryItem {
  id: string;
  orderId: string;
  merchantName: string;
  distanceKm: number;
  earnings: number;
  deliveredAt: Date;
}

export interface DeliveryHistoryResponse {
  data: DeliveryHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DriverReviewWithPartialUser {
  id: string;
  userId: string;
  driverId: string;
  rating: number;
  comment: string;
  user?: {
    id: string;
    image?: string | null;
  };
}

export interface DriverReviewsResponse {
  data: DriverReviewWithPartialUser[];
  total: number;
  averageRating: number;
  page: number;
  limit: number;
}

export interface RegisterDriverInput {
  plateNumber: string;
  latitude: number;
  longitude: number;
}

export interface UpdateDriverProfileInput {
  plateNumber?: string;
}

export interface UpdateLocationInput {
  latitude: number;
  longitude: number;
}
