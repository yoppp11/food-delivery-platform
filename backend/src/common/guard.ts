/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { Merchant, User } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { Roles } from "./decorators";
import { PrismaService } from "./prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User; session: any }>();

    const user = await this.prisma.user.findFirst({
      where: { id: request.user.id },
    });
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;

    const role = user?.role ? roles.includes(user.role) : false;

    return role;
  }
}

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User; merchant: Merchant }>();
    const user = request.user;
    const merchantId = request.headers["x-merchant-id"] as string;
    if (!merchantId)
      throw new HttpException(
        "X-Merchant-Id is required",
        HttpStatus.BAD_REQUEST
      );

    const merchant = await this.prisma.merchant.findFirst({
      where: {
        id: merchantId,
        ownerId: user.id,
      },
    });

    if (!merchant)
      throw new HttpException("You dont have access", HttpStatus.FORBIDDEN);

    this.logger.info(merchant)

    request.merchant = merchant;

    return true;
  }
}
