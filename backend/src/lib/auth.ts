import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaService } from "../services/prisma/prisma.service";

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
      secret: process.env.BETTER_AUTH_SECRET!,
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
    });
  }
}

export const auth = new Auth(new PrismaService()).auth();

export type Session = typeof auth.$Infer.Session;
