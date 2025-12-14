import { Module } from "@nestjs/common";
import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "../lib/auth";

@Module({
  imports: [
    BetterAuthModule.forRoot({
      instance: auth,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}

