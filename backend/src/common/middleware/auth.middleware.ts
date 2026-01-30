import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { User } from "@prisma/client";
import { Auth } from "../auth.service";
import { PrismaService } from "../prisma.service";
import { fromNodeHeaders } from "better-auth/node";

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
    const session = await this.auth.auth().api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      this.logger.error("AuthMiddleware - No session found");
      throw new UnauthorizedException("No session found");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    req.user = user;

    next();
  }
}
