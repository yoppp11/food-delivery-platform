import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";

@Module({
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
