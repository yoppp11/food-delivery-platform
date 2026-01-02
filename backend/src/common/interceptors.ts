/* eslint-disable prettier/prettier */
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "./prisma.service";
import { Request } from "express";
import { User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<User>> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user: User; currentUser: User | null }>();

    if (req.user?.id) {
      req.currentUser = await this.prisma.user.findFirst({
        where: { id: req.user.id },
      });
    }

    return next.handle();
  }
}
