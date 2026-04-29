import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import env from '../config/env.js';

const url = new URL(env.DATABASE_URL);
const database = url.pathname.replace('/', '');

if (!database) {
  throw new Error('DATABASE_URL must include a database name.');
}

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database,
  connectionLimit: 10,
  acquireTimeout: 10_000,
  connectTimeout: 10_000,
});

// Prevent multiple PrismaClient instances during hot reload in development
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
