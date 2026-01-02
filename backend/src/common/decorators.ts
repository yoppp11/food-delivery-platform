/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Merchant, User } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { currentUser: User }>();

    return request.currentUser;
  }
);

export const CurrentMerchant = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { merchant: Merchant }>();

    return request.merchant;
  }
);

export const Roles = Reflector.createDecorator<string[]>();
