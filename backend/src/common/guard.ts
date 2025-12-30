import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { User } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { Roles } from "./decorators";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
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
