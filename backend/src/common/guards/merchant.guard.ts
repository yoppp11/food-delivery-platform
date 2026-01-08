import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Merchant, User } from "@prisma/client";

@Injectable()
export class MerchantGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User; merchant: Merchant }>();
    const user = request.user;
    const merchantId = request.headers["x-merchant-id"] as string;
    if (!merchantId)
      throw new HttpException(
        "X-Merchant-Id is required",
        HttpStatus.BAD_REQUEST,
      );

    const merchant = await this.prisma.merchant.findFirst({
      where: {
        id: merchantId,
        ownerId: user.id,
      },
    });

    if (!merchant)
      throw new HttpException("You dont have access", HttpStatus.FORBIDDEN);

    this.logger.info(merchant);

    request.merchant = merchant;

    return true;
  }
}
