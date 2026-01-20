import z from "zod";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export const UpdateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type UpdateLocation = z.infer<typeof UpdateLocationSchema>;

export const RegisterDriverSchema = z.object({
  plateNumber: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export type RegisterDriver = z.infer<typeof RegisterDriverSchema>;

export const UpdateDriverProfileSchema = z.object({
  plateNumber: z.string().min(1).optional(),
});

export type UpdateDriverProfile = z.infer<typeof UpdateDriverProfileSchema>;

export interface DriverEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalDeliveries: number;
}

export interface EarningsHistory {
  data: {
    date: string;
    amount: number;
    deliveryCount: number;
  }[];
  total: number;
  page: number;
  limit: number;
}
