import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var prisma` in development (hot reload safe)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const isProd = process.env.NODE_ENV === "production";

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: isProd ? ["error", "warn"] : ["query", "error", "warn"],
  });

if (!isProd) global.prisma = prisma;

// Re-export Prisma types and the generated enum client.
export * from "@prisma/client";
// `Decimal` is correctly exported from the runtime library entry.
export { Decimal } from "@prisma/client/runtime/library";
export type PrismaClientType = PrismaClient;
