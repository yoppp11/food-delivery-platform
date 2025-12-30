import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { Request, Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { User } from "@prisma/client";
import { Auth } from "../auth.service";
import { PrismaService } from "../prisma.service";
import { UnauthorizedError } from "../exception.filter";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware<
  Request,
  Response
> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private auth: Auth,
    private prisma: PrismaService,
  ) {}

  async use(
    req: Request & { user: User },
    res: Response,
    next: (error?: any) => void,
  ) {
    const session = await this.auth.auth().api.getSession();

    if (!session) {
      return new UnauthorizedError();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }

    req.user = user;
    this.logger.info("=====>", user);

    next();
  }
}
