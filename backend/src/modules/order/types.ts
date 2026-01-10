import z from "zod";

export const CreateOrderSchema = z.object({
  merchantId: z.uuid(),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
