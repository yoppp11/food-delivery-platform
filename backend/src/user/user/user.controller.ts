import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import type { UserSession } from "@thallesp/nestjs-better-auth";
import {
  AllowAnonymous,
  OptionalAuth,
  Session,
} from "@thallesp/nestjs-better-auth";
import { User } from "../../generated/zod";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get("public")
  @AllowAnonymous()
  getPublicInfo() {
    return { message: "Public route" };
  }

  @Get("optional")
  @OptionalAuth()
  getOptionalInfo(@Session() session?: UserSession) {
    return { authenticated: !!session };
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body("name") name: string,
    @Body("address") address: string,
    @Body("phone") phone: string,
  ): Promise<User> {
    return await this.userService.updateUser(id, {
      name,
      address,
      phoneNumber: phone,
    });
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string): Promise<string | undefined> {
    return await this.userService.deleteUser(id);
  }
}
