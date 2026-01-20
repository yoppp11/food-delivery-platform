import z from "zod";

export const CreateOrderSchema = z.object({
  merchantId: z.string(),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export type OrderStatus =
  | "CREATED"
  | "PAID"
  | "PREPARING"
  | "READY"
  | "ON_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export const GetOrdersQuerySchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export type GetOrdersQuery = z.infer<typeof GetOrdersQuerySchema>;

export interface OrderListResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderWithDetails {
  id: string;
  userId: string;
  merchantId: string;
  driverId: string | null;
  status: string;
  totalPrice: number;
  deliveryFee: number | null;
  paymentStatus: string;
  items: any[];
  statusHistories: any[];
  merchant: {
    id: string;
    name: string;
  };
}
