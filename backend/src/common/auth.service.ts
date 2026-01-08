import { Injectable } from "@nestjs/common";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "./prisma.service";

@Injectable()
export class Auth {
  constructor(private prisma: PrismaService) {}

  auth() {
    return betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: "postgresql",
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      basePath: "/auth",
      secret: process.env.BETTER_AUTH_SECRET!,
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
      trustedOrigins: ["http://localhost:4000", "http://localhost:5173"],
    });
  }
}

export const auth = new Auth(new PrismaService()).auth();

export type Session = typeof auth.$Infer.Session;
