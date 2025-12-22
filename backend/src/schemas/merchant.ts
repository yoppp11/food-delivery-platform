import z from "zod";

export const CreateMerchantSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(4),
  description: z.string().min(10).optional(),
  latitude: z.number(),
  longitude: z.number(),
  isOpen: z.boolean().default(true),
  rating: z.number().optional(),
});

export type CreateMerchantRequest = z.infer<typeof CreateMerchantSchema>;
