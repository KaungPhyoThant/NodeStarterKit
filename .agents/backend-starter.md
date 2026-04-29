# Backend Starter Agent Guide

Use this when an AI agent needs to extend the starter kit.

## Add a Resource Module

1. Add `src/modules/<resources>/<resources>.schema.ts`.
2. Add `src/modules/<resources>/<resources>.routes.ts`.
3. Add `src/modules/<resources>/<resources>.service.ts` when logic is reused or touches multiple Prisma calls.
4. Register the router in `src/app.ts` with `/api/<resources>`.
5. Add or update Prisma models in `prisma/schema.prisma`.
6. Run `pnpm db:generate` and `pnpm typecheck`.

## Route Handler Pattern

```ts
router.post('/', requireAuth, validate(createResourceSchema), async (req, res) => {
  try {
    const resource = await createResource(req.user!.id, req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create resource.';
    res.status(500).json({ success: false, message });
  }
});
```

## Database Pattern

```ts
import { prisma } from '../../db/prisma';
```

Never instantiate `PrismaClient` outside `src/db/prisma.ts`.

