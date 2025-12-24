import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Auth } from "./auth.service";

@Global()
@Module({
  providers: [PrismaService, Auth],
  exports: [PrismaService, Auth],
})
export class LibModule {}
