import z from "zod";

export const CreateMenuSchema = z.object({
  categoryId: z.uuid(),
  name: z.string().min(4),
  description: z.string().min(10).optional(),
  price: z.number().positive(),
  isAvailable: z.boolean(),
  imageId: z.string().optional(),
});

export type CreateMenu = z.infer<typeof CreateMenuSchema>;
