/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import {
  CreateMerchantRequest,
  CreateMerchantSchema,
} from "../../schemas/merchant";
import { ValidationService } from "../../validation/validation.service";
import { UserResponse } from "../../schemas/user";
import type { Merchant } from "@prisma/client";

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createTenant(data: CreateMerchantRequest): Promise<Merchant> {
    try {
      const normalizeData = this.validation.validate(
        CreateMerchantSchema,
        data,
      );

      this.logger.info(normalizeData);

      const response = await fetch("http://localhost:3000/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({
          email: normalizeData.email,
          password: normalizeData.password,
        }),
        headers: {
          Origin: "http://localhost:3000",
          "Content-type": "application/json",
        },
      });

      const responseData: UserResponse = await response.json();

      this.logger.info(response.status);
      this.logger.info(response.ok);
      this.logger.info(responseData);

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const user = await this.prisma.merchant.create({
        data: {
          ownerId: responseData.user.id,
          name: normalizeData.name,
          description: normalizeData.description ?? null,
          latitude: normalizeData.latitude,
          longitude: normalizeData.longitude,
        },
      });

      return user;
    } catch (error) {
      this.logger.error(error, "<====");
      this.logger.error(typeof error);
      throw error;
    }
  }
}
