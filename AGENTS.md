# Agent Instructions

This repository is a backend starter kit. Keep changes small, module-oriented, and production-ready.

## Architecture

- Source code lives in `src/`.
- `src/server.ts` starts the HTTP server.
- `src/app.ts` wires middleware, routes, health check, 404s, and error handling.
- `src/config/` contains application configuration and third-party setup.
- `src/db/prisma.ts` owns the Prisma client.
- `src/middleware/` contains shared Express middleware.
- `src/modules/<feature>/` contains feature routes, schemas, services, and feature-local helpers.
- `src/types/` contains global TypeScript declarations.
- `prisma/schema.prisma` is the database source of truth.

## Naming

- Use plural module folders for resources: `users`, `projects`, `teams`.
- Route files: `<module>.routes.ts`.
- Validation files: `<module>.schema.ts`.
- Service files: `<module>.service.ts`.
- Middleware files: `<purpose>.middleware.ts`.
- Keep imports relative unless a path alias is intentionally introduced.

## Implementation Rules

- Validate request bodies, params, and query objects with Zod.
- Use `validate(schema)` from `src/middleware/validation.middleware.ts`.
- Protect private routes with `requireAuth`.
- Use `req.user` only after `requireAuth`.
- Do not create extra Prisma clients. Import `prisma` from `src/db/prisma.ts`.
- Keep route handlers thin. Move reusable business logic into a module service.
- Return JSON in the existing shape: `{ success: boolean, data?: unknown, message?: string, errors?: unknown }`.
- Do not commit secrets. Use `.env.example` for required variables.

## Verification

Run these before handing work back:

```bash
pnpm typecheck
pnpm build
```

If database behavior changes, also run:

```bash
pnpm db:generate
```
