import z from "zod";
import { NotificationType } from "@prisma/client";

export const GetNotificationsQuerySchema = z.object({
  type: z.nativeEnum(NotificationType).optional(),
  isRead: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export type GetNotificationsQuery = z.infer<typeof GetNotificationsQuerySchema>;

export const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.nativeEnum(NotificationType),
  message: z.string().min(1),
});

export type CreateNotification = z.infer<typeof CreateNotificationSchema>;

export interface NotificationListResponse {
  data: any[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
}
