import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { User } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { Roles } from "./decorators";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();

    const user = request.user;
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;

    return roles.includes(user.role);
  }
}
