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

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {}

  async createTenant(data: CreateMerchantRequest) {
    try {
      const normalizeData = this.validation.validate(
        CreateMerchantSchema,
        data
      );

      const response = await fetch("http://localhost:3000/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({
          email: normalizeData.email,
          password: normalizeData.password,
        }),
        headers: {
          Origin: "http://localhost:3000",
        },
      });

      if (!response.ok) {
        throw new Error("Internal Server Error");
      }

      const responseData: UserResponse = await response.json();

      const user = await this.prisma.merchant.create({
        data: {
          ownerId: responseData.user.id,
          name: normalizeData.name,
          email: responseData.user.email,
          description: normalizeData.description ?? null,
          latitude: normalizeData.latitude,
          longitude: normalizeData.longitude,
        },
      });


    } catch (error) {
      this.logger.error(error);
    }
  }
}
