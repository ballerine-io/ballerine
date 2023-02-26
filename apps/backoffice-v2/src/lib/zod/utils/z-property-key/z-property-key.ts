import { z } from 'zod';

export const zPropertyKey = z.union([z.string(), z.number(), z.symbol()]);
