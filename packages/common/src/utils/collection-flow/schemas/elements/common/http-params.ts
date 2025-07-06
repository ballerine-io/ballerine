import { z } from 'zod';

export const CommonHttpParamsSchema = z.object({
  url: z.string(),
  method: z.union([z.literal('GET'), z.literal('POST'), z.literal('PUT'), z.literal('DELETE')]),
  resultPath: z.string(),
  headers: z.record(z.string(), z.string()).optional(),
  timeout: z.number().optional(),
  params: z.record(z.string(), z.any()).optional(),
});
