import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../db/prisma.js';
import env from './env.js';

const trustedOrigins = [
  env.BETTER_AUTH_URL,
  ...env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
].filter(Boolean);

export const auth = betterAuth({
  basePath: '/api/auth/provider',
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins,
});
