/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { User } from "@prisma/client";
import { Reflector } from "@nestjs/core";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { currentUser: User }>();

    return request.currentUser;
  },
);

export const Roles = Reflector.createDecorator<string[]>();
