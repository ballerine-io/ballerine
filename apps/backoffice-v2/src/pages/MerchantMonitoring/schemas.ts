import { z } from 'zod';

export const FindingsSchema = z.array(z.object({ value: z.string(), title: z.string() }));
