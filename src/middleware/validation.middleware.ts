import { Request, Response, NextFunction } from 'express';
import { ZodIssue, ZodSchema } from 'zod';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Middleware factory that validates req[target] against a Zod schema.
 * On success, replaces req[target] with the parsed (coerced) data.
 * On failure, returns 422 with structured field errors.
 */
export const validate =
  (schema: ZodSchema, target: ValidateTarget = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors: result.error.issues.map((issue: ZodIssue) => ({
          field: issue.path.join('.') || target,
          message: issue.message,
        })),
      });
      return;
    }

    // Replace with Zod-parsed data so defaults/coercions are applied
    (req as any)[target] = result.data;
    next();
  };
