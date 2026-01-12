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
