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
import type { Cart, User } from "@prisma/client";
import { CreateCart } from "./types";

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getAll(id: string): Promise<Cart[]> {
    try {
      this.logger.info("service cart");
      const cart = await this.prisma.cart.findMany({
        where: {
          userId: id,
        },
        include: {
          cartItems: true,
        },
      });

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async createCart(body: CreateCart, user: User): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.findFirst({
        where: {
          userId: user.id
        },
        include: {
          cartItems: true
        }
      })

      if(cart?.merchantId !== body.merchantId) {
        await this.prisma.cart.deleteMany({
          where: { id: cart?.id }
        })
      }

      await this.prisma.$transaction([
        const cartItemExist = cart?.cartItems.some(c => c.menuId === body.menuId)

        if(cartItemExist) {
          await this.prisma.cartItem.update({
            where: { menuId: body.menuId },
            data: { quantity: +1 }
          })
        }
        this.prisma.
      ])

      return cart

    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
