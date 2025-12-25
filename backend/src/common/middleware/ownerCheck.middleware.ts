import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "../prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class OwnerCheck implements NestMiddleware<Request, Response> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) logger: Logger,
    private prisma: PrismaService
  ) {}

  async use(req: Request & { user: User }, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const param = req.params.id;

    if (!userId) {
      throw new HttpException(
        "User not authenticated",
        HttpStatus.UNAUTHORIZED,
      );
    }

    const data = await this.prisma.menu.findFirst({
      where: {
        id: param,
        merchant: {
          ownerId: param,
        },
      },
    });

    if (!data) {
      throw new HttpException(`You don't have access`, HttpStatus.FORBIDDEN);
    }

    next();
  }
}
