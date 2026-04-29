import { config } from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';

config({ path: `.env.${nodeEnv}.local` });
config({ path: `.env.${nodeEnv}` });

const env = {
  PORT: process.env.PORT ?? '8000',
  NODE_ENV: nodeEnv,
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? '',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? 'http://localhost:8000',
  CORS_ORIGINS:
    process.env.CORS_ORIGINS ??
    process.env.FRONTEND_URL ??
    'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173',
} as const;

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}
if (!env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is not defined in environment variables.');
}

export default env;
