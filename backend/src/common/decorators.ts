/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { User } from "@prisma/client";
import { PrismaService } from "./prisma.service";

const prisma = new PrismaService();

export const AuthDec = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user: User }>();

    const user = await prisma.merchant.findFirst({
      where: {
        ownerId: request.user.id,
      },
    });

    return user;
  }
);

export const MerchantDec = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user: User }>();

    const merchant = await prisma.merchant.findFirst({
      where: {
        ownerId: request.user.id,
      },
    });

    return merchant;
  }
);
