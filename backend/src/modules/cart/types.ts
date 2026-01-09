import z from "zod";

export const CreateCartSchema = z.object({
  merchantId: z.uuid(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      menuId: z.uuid(),
      menuName: z.string(),
      basePrice: z.number().positive(),
      quantity: z.number().positive(),
      notes: z.string().optional(),
    }),
  ),
});

export type DeleteType = "PARTIAL" | "ALL";

export type EditType = "INCREMENT" | "DECREMENT";

export type CreateCart = z.infer<typeof CreateCartSchema>;
