import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import { GetNotificationsQuerySchema } from "./types";
import type { GetNotificationsQuery, NotificationListResponse } from "./types";
import type { Notification, User } from "@prisma/client";

@Controller("notifications")
@UseGuards(PermissionGuard)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async getNotifications(
    @CurrentUser() user: User,
    @Query(new ZodValidationPipe(GetNotificationsQuerySchema))
    query: GetNotificationsQuery,
  ): Promise<NotificationListResponse> {
    return await this.service.getNotifications(user, query);
  }

  @Get("unread")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async getUnreadNotifications(
    @CurrentUser() user: User,
  ): Promise<Notification[]> {
    return await this.service.getUnreadNotifications(user);
  }

  @Get("unread/count")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async getUnreadCount(@CurrentUser() user: User): Promise<{ count: number }> {
    return await this.service.getUnreadCount(user);
  }

  @Patch(":id/read")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async markAsRead(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Notification> {
    return await this.service.markAsRead(id, user);
  }

  @Patch("read-all")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async markAllAsRead(@CurrentUser() user: User): Promise<{ count: number }> {
    return await this.service.markAllAsRead(user);
  }

  @Delete(":id")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async deleteNotification(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Notification> {
    return await this.service.deleteNotification(id, user);
  }

  @Delete("clear")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async clearAllNotifications(
    @CurrentUser() user: User,
  ): Promise<{ count: number }> {
    return await this.service.clearAllNotifications(user);
  }
}
