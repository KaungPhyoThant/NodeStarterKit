# Backend Starter Kit

A ready-to-start TypeScript backend starter kit using Express, Prisma, MariaDB, Better Auth, and Zod. Follows NestJS-style module structure so the codebase is familiar when migrating to NestJS later.

## Stack

- **Express** — HTTP routing
- **Prisma** — database ORM (MariaDB/MySQL)
- **Better Auth** — email and password authentication with session management
- **Zod** — request validation
- **Pino** — structured JSON logging
- **TSX + Nodemon** — local development with hot reload

## Project Structure

```text
.
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── src/
    ├── app.ts               # Express app: middleware + route registration + error handler
    ├── server.ts            # HTTP server entry point
    ├── config/
    │   ├── auth.ts          # Better Auth initialisation
    │   └── env.ts           # Environment variables with validation
    ├── db/
    │   └── prisma.ts        # Prisma client singleton
    ├── middleware/
    │   ├── auth.middleware.ts        # requireAuth — session guard
    │   ├── cors.middleware.ts        # CORS allowlist
    │   └── validation.middleware.ts  # validate() — Zod middleware factory
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.ts   # Route handlers (HTTP layer)
    │   │   ├── auth.service.ts      # Business logic
    │   │   └── auth.dto.ts          # Zod schemas + inferred types
    │   └── users/
    │       ├── users.controller.ts
    │       └── users.service.ts
    ├── utils/
    │   ├── errors.ts        # AppError base class + typed subclasses
    │   └── logger.ts        # Pino logger instance
    └── types/
        └── express.d.ts     # Augments req.user and req.session
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

3. Fill in the required variables in `.env.development`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MariaDB connection string, e.g. `mysql://user:pass@localhost:3306/mydb` |
| `BETTER_AUTH_SECRET` | Random secret for session signing (32+ chars) |
| `BETTER_AUTH_URL` | Public URL of this API, e.g. `http://localhost:8000` |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins |

The app loads `.env.<NODE_ENV>.local` first, then `.env.<NODE_ENV>`. For local development `NODE_ENV` defaults to `development`.

For cookie auth from a separate frontend, add your frontend origin to `CORS_ORIGINS` and call the API with `credentials: 'include'`.

4. Generate Prisma client and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

5. Start the development server:

```bash
pnpm dev
```

The API runs at `http://localhost:8000` by default.

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the development server with hot reload |
| `pnpm start:dev` | Start the server directly with TSX (no nodemon) |
| `pnpm start` | Start the compiled server from `dist/` |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm typecheck` | Type-check without emitting files |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run migrations (development) |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:push` | Push schema changes without a migration |

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create a new account |
| `POST` | `/api/auth/login` | — | Sign in and receive a session cookie |
| `POST` | `/api/auth/logout` | Required | Invalidate the current session |
| `GET` | `/api/auth/me` | Required | Current user + session info |
| `ALL` | `/api/auth/provider/*` | — | Better Auth native provider routes |
| `GET` | `/api/users/me` | Required | Current user profile |

## Error Handling

All errors thrown in services propagate to the global error handler in `app.ts` via `next(error)`. Controllers do not need their own error handling logic.

Use the typed error classes from `src/utils/errors.ts`:

```ts
import { NotFoundError, ConflictError, ForbiddenError } from '../../utils/errors.js';

// In a service:
throw new NotFoundError('Post not found.');
throw new ConflictError('Email already in use.');
```

| Class | Status |
|---|---|
| `BadRequestError` | 400 |
| `UnauthorizedError` | 401 |
| `ForbiddenError` | 403 |
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| `AppError(message, statusCode)` | any |

Unexpected errors (anything that is not an `AppError`) are logged with Pino and return `500`.

## Logging

Requests are logged automatically by `pino-http`. In development, logs are pretty-printed. In production, logs are JSON.

For manual logging in services or utilities, import the logger:

```ts
import logger from '../../utils/logger.js';

logger.info('Something happened.');
logger.error(err, 'Unexpected failure.');
```

## Adding a Feature

1. Create a folder under `src/modules/<feature-name>/`:

```text
src/modules/posts/
├── posts.controller.ts   # Router — HTTP only, calls service, passes errors to next()
├── posts.service.ts      # Business logic — throws typed errors
└── posts.dto.ts          # Zod schemas + inferred types
```

2. Register the router in `src/app.ts`:

```ts
import postsController from './modules/posts/posts.controller.js';

app.use('/api/posts', postsController);
```

**Controller pattern:**

```ts
router.post('/', validate(createPostDto), async (req, res, next) => {
  try {
    const post = await postsService.create(req.body, req.user!.id);
    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    next(error); // let the global handler deal with it
  }
});
```

**Service pattern:**

```ts
async create(dto: CreatePostDto, userId: string) {
  const existing = await prisma.post.findFirst({ where: { title: dto.title } });
  if (existing) throw new ConflictError('A post with this title already exists.');
  return prisma.post.create({ data: { ...dto, userId } });
}
```

Use `src/db/prisma.ts` for database access, `src/middleware/validation.middleware.ts` for Zod validation, and `src/middleware/auth.middleware.ts` for protected routes.
