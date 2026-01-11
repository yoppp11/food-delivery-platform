/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma.service";
import { Request } from "express";
import { Driver, Merchant, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

export interface ResourceTypeOwnership {
  resourceType: "menu" | "category";
  idParam?: string;
}

export const ResourceType = Reflector.createDecorator<ResourceTypeOwnership>();

export class CheckOwnershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User; merchant: Merchant }>();
    this.logger.info("sebelum reflector")
    const options = this.reflector.get(ResourceType, context.getHandler());
    this.logger.info("sesudah reflector")

    const user = request.user;
    const merchant = request.merchant;
    const resourceId = request.params[options.idParam || "id"];

    if (!resourceId)
      throw new HttpException(
        "Resource ID is required",
        HttpStatus.BAD_REQUEST
      );

    const isOwner = await this.validateOwnership(
      options.resourceType,
      user,
      merchant,
      resourceId
    );

    if (!isOwner)
      throw new HttpException(
        `You don't have permission to modify this ${options.resourceType}`,
        HttpStatus.FORBIDDEN
      );

    return true;
  }

  private validateOwnership(
    resourceType: "menu" | "category",
    user: User,
    merchant: Merchant,
    resourceId: string
  ) {
    switch (resourceType) {
      case "menu":
        return this.validateMenuOwnership(user, merchant, resourceId);
      case "category":
        return this.validateCategoryOwnership(user, merchant, resourceId);
      default:
        return false;
    }
  }

  private async validateMenuOwnership(
    user: User,
    merchant: Merchant,
    id: string
  ) {
    const menu = await this.prisma.menu.findFirst({
      where: { id },
      include: {
        merchant: true,
      },
    });

    if (!menu) throw new HttpException("Menu not found", HttpStatus.NOT_FOUND);

    return merchant.id === menu.merchantId && user.id === menu.merchant.ownerId;
  }

  private async validateCategoryOwnership(
    user: User,
    merchant: Merchant,
    id: string
  ) {
    const category = await this.prisma.merchantMenuCategory.findFirst({
      where: { id },
      include: {
        merchant: true,
      },
    });

    if (!category)
      throw new HttpException("Category not found", HttpStatus.NOT_FOUND);

    return (
      category.merchantId === merchant.id &&
      category.merchant.ownerId === user.id
    );
  }
}

@Injectable()
export class OrderOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<
        Request & { currentUser: User & { driver: Driver; merchant: Merchant } }
      >();
    const orderId = request.params["id"];
    const user = request.currentUser;

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order)
      throw new HttpException("Order not found", HttpStatus.NOT_FOUND);

    let isOwner: boolean = false;

    if (user.role === "CUSTOMER") isOwner = order.userId === user.id;

    if (user.role === "DRIVER") isOwner = order.driverId === user.driver.id;

    if (user.role === "MERCHANT")
      isOwner = order.merchantId === user.merchant.id;

    if (!isOwner)
      throw new HttpException("You dont have access", HttpStatus.FORBIDDEN);

    return true;

    return true;
  }
}
