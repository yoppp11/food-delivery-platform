import { Injectable } from "@nestjs/common";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "./prisma.service";
import "dotenv/config";

@Injectable()
export class Auth {
  constructor(private prisma: PrismaService) {}

  auth() {
    const isProduction = process.env.NODE_ENV === "production";

    const defaultOrigins = [
      "http://localhost:4000",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://food-delivery-platform-virid.vercel.app",
      "https://food-delivery-platform-production-add3.up.railway.app",
    ];

    const envOrigins = process.env.TRUSTED_ORIGINS
      ? process.env.TRUSTED_ORIGINS.split(",").map((o) => o.trim())
      : [];

    // Combine default and env origins, removing duplicates
    const trustedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

    console.log("[Auth] NODE_ENV:", process.env.NODE_ENV);
    console.log("[Auth] Trusted Origins:", trustedOrigins);
    console.log("[Auth] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);

    return betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: "postgresql",
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      basePath: "/api/auth",
      secret: process.env.BETTER_AUTH_SECRET!,
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      trustedOrigins: trustedOrigins,
      advanced: {
        crossSubDomainCookies: {
          enabled: isProduction,
        },
        defaultCookieAttributes: {
          secure: isProduction,
          httpOnly: true,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
        },
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            required: false,
            defaultValue: "CUSTOMER",
            input: false,
          },
          status: {
            type: "string",
            required: false,
            defaultValue: "ACTIVE",
            input: false,
          },
          phoneNumber: {
            type: "string",
            required: false,
            input: false,
          },
        },
      },
    });
  }
}

export const auth = new Auth(new PrismaService()).auth();

export type Session = typeof auth.$Infer.Session;
