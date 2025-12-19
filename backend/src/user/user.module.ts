import { Module } from "@nestjs/common";
import { UserController } from "./user/user.controller";
import { PrismaService } from "../services/prisma/prisma.service";
import { PrismaModule } from "../services/prisma/prisma.module";

@Module({
  controllers: [UserController],
  providers: [PrismaService],
  imports: [PrismaModule],
})
export class UserModule {}
