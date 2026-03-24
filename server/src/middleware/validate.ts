import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidateSource = 'body' | 'query';

/**
 * Generic middleware factory that validates req.body or req.query against a Zod schema.
 * Returns 400 with structured field errors on failure.
 */
export const validate =
  (schema: ZodSchema, source: ValidateSource = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const input = source === 'query' ? req.query : req.body;
    const result = schema.safeParse(input);

    if (!result.success) {
      const flat = (result.error as ZodError).flatten();
      const errors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
        errors[key] = (msgs as string[] | undefined)?.[0] ?? 'Invalid value';
      }

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // Replace source with the coerced/trimmed Zod output
    if (source === 'query') {
      req.query = result.data as any;
    } else {
      req.body = result.data;
    }
    next();
  };
