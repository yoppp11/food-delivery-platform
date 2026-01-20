import z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export interface CategoryWithCount {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  merchantCount: number;
}
