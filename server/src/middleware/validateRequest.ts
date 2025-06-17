import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validateRequest = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For login route, validate the body directly
      if (req.path === '/login') {
        await schema.parseAsync(req.body);
      } else {
        // For other routes, validate the entire request
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params
        });
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        next(new AppError('Validation failed', 400, errors));
      } else {
        next(error);
      }
    }
  };
}; 