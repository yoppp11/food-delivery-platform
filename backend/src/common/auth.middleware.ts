import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.info(req);
    this.logger.info(typeof req, "<=======");
    this.logger.info(res);
    this.logger.info(typeof res, "<=======");
    next();
  }
}
