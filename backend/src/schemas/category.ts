import z from "zod";

export const CreateMenuCategorySchema = z.object({
  name: z.string().min(4),
  merchantId: z.uuid().optional(),
});

export const UpdateMenuCategorySchema = CreateMenuCategorySchema.pick({
  name: true,
})
  .partial()
  .strict();

export type CreateCategory = z.infer<typeof CreateMenuCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateMenuCategorySchema>;
