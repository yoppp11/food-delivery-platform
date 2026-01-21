import z from "zod";

export const UpdateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"]),
});

export type UpdateUserStatus = z.infer<typeof UpdateUserStatusSchema>;

export const VerifyMerchantSchema = z.object({
  verified: z.boolean(),
});

export type VerifyMerchant = z.infer<typeof VerifyMerchantSchema>;

export const CreatePromotionSchema = z.object({
  code: z.string().min(1).max(50),
  discountType: z.enum(["PERCENT", "FLAT"]),
  discountValue: z.number().positive(),
  maxDiscount: z.number().optional(),
  expiredAt: z.string(),
});

export type CreatePromotion = z.infer<typeof CreatePromotionSchema>;

export const UpdatePromotionSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  discountType: z.enum(["PERCENT", "FLAT"]).optional(),
  discountValue: z.number().positive().optional(),
  maxDiscount: z.number().optional(),
  expiredAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePromotion = z.infer<typeof UpdatePromotionSchema>;

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export interface DashboardStats {
  totalUsers: number;
  totalMerchants: number;
  totalDrivers: number;
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
}

export interface AdminUserListResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
