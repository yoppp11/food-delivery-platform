import { User } from "@prisma/client";
import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(4).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().min(5).optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

export type UserResponse = {
  token: string;
  user: User;
};
