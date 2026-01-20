import z from "zod";

export const UpdateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"]),
});

export type UpdateUserStatus = z.infer<typeof UpdateUserStatusSchema>;

export const VerifyMerchantSchema = z.object({
  verified: z.boolean(),
});

export type VerifyMerchant = z.infer<typeof VerifyMerchantSchema>;

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
