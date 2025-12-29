import z from "zod";

export const MenuVariantSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(4),
  price: z.number().positive(),
})

export const CreateMenuSchema = z.object({
  categoryId: z.uuid(),
  name: z.string().min(4),
  description: z.string().min(10),
  price: z.number().positive(),
  isAvailable: z.boolean(),
  imageId: z.string().optional(),
  menuVariants: z.array(MenuVariantSchema).optional(),
});

export const UpdateMenuSchema = CreateMenuSchema.partial();

export type CreateMenu = z.infer<typeof CreateMenuSchema>;
export type UpdateMenu = z.infer<typeof UpdateMenuSchema>;
