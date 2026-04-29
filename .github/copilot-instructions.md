# Copilot Instructions

This is a TypeScript Express backend starter kit. Prefer small module-oriented changes under `src/modules`.

- Keep feature code together in `src/modules/<feature>`.
- Use Zod schemas for request validation.
- Use Prisma only through `src/db/prisma.ts`.
- Use `requireAuth` for authenticated routes.
- Keep response objects consistent with `{ success, data, message, errors }`.
- Update `README.md` when setup, scripts, or route behavior changes.
- Run `pnpm typecheck` after TypeScript edits.

