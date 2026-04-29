# Backend Starter Kit

A ready-to-start TypeScript backend starter kit using Express, Prisma, MariaDB, Better Auth, and Zod.

## Stack

- Express for HTTP routing
- Prisma for database access
- MariaDB/MySQL database support
- Better Auth for email and password authentication
- Zod for request validation
- TSX and Nodemon for local development

## Project Structure

```text
.
+-- prisma/
|   +-- migrations/
|   +-- schema.prisma
+-- src/
|   +-- app.ts
|   +-- server.ts
|   +-- config/
|   +-- db/
|   +-- middleware/
|   +-- modules/
|   |   +-- auth/
|   |   +-- users/
|   +-- types/
+-- .agents/
+-- .github/
+-- AGENTS.md
+-- package.json
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Create your local environment file:

```bash
cp .env.example .env.development
```

3. Update `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CORS_ORIGINS`.

The app loads `.env.<NODE_ENV>.local` first and `.env.<NODE_ENV>` second. For local development, `NODE_ENV` defaults to `development`.

For cookie auth from a separate frontend app, add your frontend origin to `CORS_ORIGINS` and call the API with `credentials: 'include'`.

4. Generate Prisma client and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

5. Start development:

```bash
pnpm dev
```

The API runs at `http://localhost:8000` by default.

## Available Scripts

- `pnpm dev` - start the local development server
- `pnpm start:dev` - start the server directly with TSX
- `pnpm start` - start the compiled server from `dist`
- `pnpm build` - compile TypeScript into `dist`
- `pnpm typecheck` - run TypeScript without emitting files
- `pnpm db:generate` - generate Prisma client
- `pnpm db:migrate` - run Prisma development migrations
- `pnpm db:studio` - open Prisma Studio
- `pnpm db:push` - push schema changes without a migration

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `ALL /api/auth/provider/*` - Better Auth native provider routes
- `GET /api/users/me`

## Adding a Feature

Create a new folder under `src/modules/<feature-name>/` and keep the route, schema, service, and feature-specific types together. Register the route in `src/app.ts`.

Recommended module shape:

```text
src/modules/projects/
+-- projects.routes.ts
+-- projects.schema.ts
+-- projects.service.ts
```

Use `src/db/prisma.ts` for database access, `src/middleware/validation.middleware.ts` for Zod validation, and `src/middleware/auth.middleware.ts` for protected routes.
