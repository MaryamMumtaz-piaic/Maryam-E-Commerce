import type { PrismaClient } from "@prisma/client";

/** True when a database connection string is configured. */
export const isDbConfigured = Boolean(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  // Lazy require so the app boots on mock data even before `prisma generate`
  // has produced a client (i.e. when DATABASE_URL is unset).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: Client } = require("@prisma/client");
  return new Client({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

let _prisma: PrismaClient | null = null;

/** Returns a Prisma client. Only call when isDbConfigured is true. */
export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (!_prisma) _prisma = createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = _prisma;
  return _prisma;
}

/**
 * Proxy that defers client creation until a property is accessed. Lets modules
 * `import { prisma }` freely; the underlying client is only built on first use,
 * which only happens on DB-backed code paths.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    // @ts-expect-error dynamic delegation
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
