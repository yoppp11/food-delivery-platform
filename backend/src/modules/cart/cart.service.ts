/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import type { Cart } from "@prisma/client";

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getAll(id: string): Promise<Cart[]> {
    try {
      this.logger.info('service cart')
        const cart = await this.prisma.cart.findMany({
            where: {
                userId: id
            },
            include: {
              cartItems: true
            }
        })

        return cart
    } catch (error) {
      throw error;
    }
  }
}
