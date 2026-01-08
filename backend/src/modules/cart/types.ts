import z from "zod";

export const CreateCartSchema = z.object({
  merchantId: z.uuid(),
  menuId: z.uuid(),
  basePrice: z.number().positive(),
  quantity: z.number().positive(),
  notes: z.string().optional(),
});

export type CreateCart = z.infer<typeof CreateCartSchema>;
