import z from "zod";

export const CreateMerchantReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional().default(""),
});

export type CreateMerchantReview = z.infer<typeof CreateMerchantReviewSchema>;

export const UpdateMerchantReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type UpdateMerchantReview = z.infer<typeof UpdateMerchantReviewSchema>;

export const CreateDriverReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional().default(""),
});

export type CreateDriverReview = z.infer<typeof CreateDriverReviewSchema>;

export const UpdateDriverReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type UpdateDriverReview = z.infer<typeof UpdateDriverReviewSchema>;

export interface ReviewListResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
