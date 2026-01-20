import z from "zod";

export const CreateAddressSchema = z.object({
  label: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  isDefault: z.boolean().optional().default(false),
});

export type CreateAddress = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = z.object({
  label: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateAddress = z.infer<typeof UpdateAddressSchema>;
