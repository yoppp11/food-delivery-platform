import { Body, Controller, Post } from "@nestjs/common";
import { MerchantService } from "./merchant.service";
import { CreateMerchantRequest } from "../../schemas/merchant";
import { Merchant } from "@prisma/client";

@Controller("merchant")
export class MerchantController {
  constructor(private service: MerchantService) {}

  @Post()
  async createMerchant(@Body() body: CreateMerchantRequest): Promise<Merchant> {
    return;
  }
}
