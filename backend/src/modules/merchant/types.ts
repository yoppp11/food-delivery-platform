import z from "zod";

export interface MerchantResponse {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  rating: number | null;
  createdAt: Date;
  reviewCount?: number;
  distance?: number | null;
}

export const GetMerchantsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isOpen: z.string().optional(),
  sortBy: z.enum(["rating", "distance", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

export type GetMerchantsQuery = z.infer<typeof GetMerchantsQuerySchema>;

export const UpdateMerchantSchema = z.object({
  name: z.string().min(4).optional(),
  description: z.string().min(10).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isOpen: z.boolean().optional(),
});

export type UpdateMerchant = z.infer<typeof UpdateMerchantSchema>;

export const CreateOperationalHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string(),
  closeTime: z.string(),
});

export type CreateOperationalHour = z.infer<typeof CreateOperationalHourSchema>;

export const UpdateOperationalHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6).optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export type UpdateOperationalHour = z.infer<typeof UpdateOperationalHourSchema>;

export const RegisterMerchantSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(10).optional(),
  latitude: z.number(),
  longitude: z.number(),
});

export type RegisterMerchant = z.infer<typeof RegisterMerchantSchema>;

export interface MerchantListResponse {
  data: MerchantResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}
