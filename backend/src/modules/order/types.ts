import z from "zod";

export const CreateOrderSchema = z.object({
  merchantId: z.uuid(),
  totalPrice: z.number().positive(),
  items: z.array(
    z.object({
      menuId: z.uuid(),
      variantId: z.uuid(),
      price: z.number().positive(),
      quantity: z.number().positive(),
      itemTotal: z.number().positive(),
      notes: z.string().optional(),
    }),
  ),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
