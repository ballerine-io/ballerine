import { z } from 'zod';

export const isBase64 = (value: unknown): value is string => {
  return z
    .string()
    .regex(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/)
    .safeParse(value).success;
};
