import { z } from 'zod';

export type RequestDocumentsInput = z.infer<typeof RequestDocumentsSchema>;
export const RequestDocumentsSchema = z.object({
  documentIds: z.array(z.string()),
});
