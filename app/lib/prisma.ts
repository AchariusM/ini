import type { PrismaClient as PrismaClientType } from "@prisma/client";

// Force the binary engine to avoid Prisma Accelerate "client" engine config.
if (process.env.PRISMA_CLIENT_ENGINE_TYPE !== "binary") {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
}
if (process.env.PRISMA_ACCELERATE_URL) {
  delete process.env.PRISMA_ACCELERATE_URL;
}

// Use require so env overrides apply before Prisma Client loads.
const { PrismaClient } = require("@prisma/client") as {
  PrismaClient: new (...args: any[]) => PrismaClientType;
};

const globalForPrisma = global as unknown as {
  prisma: PrismaClientType | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
