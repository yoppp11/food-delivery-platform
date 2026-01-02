import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import type { UserSession } from "@thallesp/nestjs-better-auth";
import {
  AllowAnonymous,
  OptionalAuth,
  Session,
} from "@thallesp/nestjs-better-auth";
import { User } from "../../generated/zod";
import { UserService } from "./user.service";
import type { UserRequest } from "./types";

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
    @Body() body: UserRequest,
  ): Promise<User> {
    return await this.userService.updateUser(id, body);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string): Promise<string | undefined> {
    return await this.userService.deleteUser(id);
  }
}
