/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { User } from "@prisma/client";

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user: User }>();

    return request.user as User;
  },
);
