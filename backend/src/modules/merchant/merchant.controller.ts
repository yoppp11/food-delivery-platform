import { Body, Controller, Post } from "@nestjs/common";
import { MerchantService } from "./merchant.service";
import type { CreateMerchantRequest } from "../../schemas/merchant";
import { Merchant } from "@prisma/client";

@Controller("merchants")
export class MerchantController {
  constructor(private service: MerchantService) {}

  @Post()
  async createMerchant(@Body() body: CreateMerchantRequest): Promise<Merchant> {
    return await this.service.createTenant(body);
  }
}
