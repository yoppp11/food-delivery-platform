/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { User } from "@prisma/client";
import { Roles } from "../decorators";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User; session: any }>();

    const user = await this.prisma.user.findFirst({
      where: { id: request.user.id },
    });
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles)
      throw new HttpException("Forbidden access", HttpStatus.FORBIDDEN);

    const role = user?.role ? roles.includes(user.role) : false;

    return role;
  }
}
