import z from "zod";

export const CreateMenuCategorySchema = z.object({
  name: z.string().min(4),
  merchantId: z.uuid(),
  desciption: z.string().optional(),
});

export type CreateCategory = z.infer<typeof CreateMenuCategorySchema>;
