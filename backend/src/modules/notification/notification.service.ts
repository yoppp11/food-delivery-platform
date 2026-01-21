import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Notification, NotificationType, User } from "@prisma/client";
import {
  CreateNotification,
  GetNotificationsQuery,
  NotificationListResponse,
} from "./types";
import { CacheService, CacheInvalidationService } from "../../common/cache";

const CACHE_TTL = {
  NOTIFICATIONS: 60000,
};

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private cacheService: CacheService,
    private cacheInvalidation: CacheInvalidationService,
  ) {}

  async getNotifications(
    user: User,
    query: GetNotificationsQuery,
  ): Promise<NotificationListResponse> {
    try {
      const { type, isRead, page, limit } = query;

      const cacheKey = this.cacheService.generateHashKey(`notifications:user:${user.id}`, query);
      const cached = await this.cacheService.get<NotificationListResponse>(cacheKey);
      if (cached) return cached;

      const where: Record<string, unknown> = { userId: user.id };

      if (type) {
        where.type = type;
      }

      if (isRead !== undefined) {
        where.isRead = isRead === "true";
      }

      const skip = (page - 1) * limit;

      const [notifications, total, unreadCount] =
        await this.prisma.$transaction([
          this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip,
          }),
          this.prisma.notification.count({ where }),
          this.prisma.notification.count({
            where: { userId: user.id, isRead: false },
          }),
        ]);

      const result = {
        data: notifications,
        unreadCount,
        total,
        page,
        limit,
      };

      await this.cacheService.set(cacheKey, result, CACHE_TTL.NOTIFICATIONS);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUnreadNotifications(user: User): Promise<Notification[]> {
    try {
      return await this.prisma.notification.findMany({
        where: { userId: user.id, isRead: false },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUnreadCount(user: User): Promise<{ count: number }> {
    try {
      const count = await this.prisma.notification.count({
        where: { userId: user.id, isRead: false },
      });

      return { count };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async markAsRead(id: string, user: User): Promise<Notification> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const notification = await this.prisma.notification.findFirst({
        where: { id, userId: user.id },
      });

      if (!notification)
        throw new HttpException("Notification not found", HttpStatus.NOT_FOUND);

      const result = await this.prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      await this.cacheInvalidation.invalidateNotificationCache(user.id);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async markAllAsRead(user: User): Promise<{ count: number }> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: { userId: user.id, isRead: false },
        data: { isRead: true },
      });

      await this.cacheInvalidation.invalidateNotificationCache(user.id);

      return { count: result.count };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteNotification(id: string, user: User): Promise<Notification> {
    try {
      if (!id)
        throw new HttpException("ID is required", HttpStatus.BAD_REQUEST);

      const notification = await this.prisma.notification.findFirst({
        where: { id, userId: user.id },
      });

      if (!notification)
        throw new HttpException("Notification not found", HttpStatus.NOT_FOUND);

      return await this.prisma.notification.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async clearAllNotifications(user: User): Promise<{ count: number }> {
    try {
      const result = await this.prisma.notification.deleteMany({
        where: { userId: user.id },
      });

      return { count: result.count };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createNotification(data: CreateNotification): Promise<Notification> {
    try {
      return await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          message: data.message,
          isRead: false,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createOrderNotification(
    userId: string,
    message: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      type: NotificationType.ORDER,
      message,
    });
  }

  async createPromoNotification(
    userId: string,
    message: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      type: NotificationType.PROMO,
      message,
    });
  }
}
