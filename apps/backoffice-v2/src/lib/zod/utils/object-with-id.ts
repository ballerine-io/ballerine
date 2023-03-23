import { z } from 'zod';

export const ObjectWithIdSchema = z.object({
  id: z.string(),
});
