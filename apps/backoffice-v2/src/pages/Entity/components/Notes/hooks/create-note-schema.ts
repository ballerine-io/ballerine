import { z } from 'zod';

export const CreateNoteSchema = z.object({
  entityId: z.string(),
  entityType: z.enum(['Business', 'EndUser']),
  noteableId: z.string(),
  noteableType: z.enum(['Report', 'Alert', 'Workflow']),
  content: z.string(),
  parentNoteId: z.union([z.string(), z.null()]),
});
