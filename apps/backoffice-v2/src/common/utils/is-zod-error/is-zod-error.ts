import { ZodError } from 'zod';

export const isZodError = (error: unknown): error is ZodError => error instanceof ZodError;
