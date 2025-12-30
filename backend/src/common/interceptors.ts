import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "./prisma.service";
import { Request } from "express";
import { User } from "@prisma/client";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
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
