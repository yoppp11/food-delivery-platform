import z from "zod";

export const AssignDriverSchema = z.object({
  driverId: z.string().uuid(),
});

export type AssignDriver = z.infer<typeof AssignDriverSchema>;

export interface DeliveryDetails {
  id: string;
  orderId: string;
  driverId: string;
  pickedAt: Date | null;
  deliveredAt: Date | null;
  distanceKm: number | null;
  driver: {
    id: string;
    userId: string;
    plateNumber: string;
    isAvailable: boolean;
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
  };
  order: {
    id: string;
    status: string;
    merchantId: string;
    merchant: {
      name: string;
      latitude: number;
      longitude: number;
    };
  };
}

export interface TrackingInfo {
  orderId: string;
  status: string;
  driver: {
    id: string;
    plateNumber: string;
    location: {
      latitude: number;
      longitude: number;
    } | null;
  } | null;
  estimatedDeliveryTime: string | null;
}
