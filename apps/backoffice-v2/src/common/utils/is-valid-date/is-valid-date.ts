import { z } from 'zod';

/**
 * @description Checks if a passed string is a datetime string.
 * @param value
 * @param strict - If false, will return true for strings that match the format YYYY-MM-DD.
 */
export const isValidDate = (value: unknown, strict = true): value is string => {
  if (typeof value !== 'string') return false;

  if (!strict && /\d{4}-\d{2}-\d{2}/.test(value)) return true;

  return z.string().datetime().safeParse(value).success;
};
