import z from "zod";
import { DiscountType } from "@prisma/client";

export const ValidatePromoSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.number().positive(),
});

export type ValidatePromo = z.infer<typeof ValidatePromoSchema>;

export const ApplyPromoSchema = z.object({
  code: z.string().min(1),
  orderId: z.string().uuid(),
});

export type ApplyPromo = z.infer<typeof ApplyPromoSchema>;

export const CreatePromotionSchema = z.object({
  code: z.string().min(1),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive(),
  maxDiscount: z.number().positive(),
  expiredAt: z.coerce.date(),
});

export type CreatePromotion = z.infer<typeof CreatePromotionSchema>;

export const UpdatePromotionSchema = z.object({
  code: z.string().min(1).optional(),
  discountType: z.nativeEnum(DiscountType).optional(),
  discountValue: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  expiredAt: z.coerce.date().optional(),
});

export type UpdatePromotion = z.infer<typeof UpdatePromotionSchema>;

export interface ValidatePromoResponse {
  valid: boolean;
  promotion?: {
    id: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount: number;
  };
  discountAmount?: number;
  message?: string;
}
