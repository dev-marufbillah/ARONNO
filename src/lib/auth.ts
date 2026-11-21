import { compare, hash } from "bcryptjs";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import {
  authAccounts,
  authSessions,
  authVerifications,
  users,
} from "@/db/schema";

const secret =
  process.env.BETTER_AUTH_SECRET ||
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET;

if (process.env.NODE_ENV === "production" && !secret) {
  throw new Error("BETTER_AUTH_SECRET (or AUTH_SECRET) must be configured for production.");
}

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXTAUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000");

if (process.env.NODE_ENV === "production" && !baseURL) {
  throw new Error("BETTER_AUTH_URL (or NEXTAUTH_URL) must be configured for production.");
}

export const auth = betterAuth({
  appName: "ARONNO",
  baseURL,
  secret,
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [baseURL!]
      : [baseURL!, "http://localhost:3000", "http://127.0.0.1:3000"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: authSessions,
      account: authAccounts,
      verification: authVerifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    password: {
      hash: (password) => hash(password, 12),
      verify: ({ hash: passwordHash, password }) =>
        compare(password, passwordHash),
    },
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
        input: false,
      },
      isSuperAdmin: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [nextCookies()],
});
