import { z } from 'zod';

const BasicNoteSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  entityType: z.enum(['Business', 'EndUser']),
  noteableId: z.string(),
  noteableType: z.enum(['Report', 'Alert', 'Workflow']),
  content: z.string(),
  fileIds: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const NoteSchema = BasicNoteSchema.extend({
  parentNote: z.union([BasicNoteSchema, z.null()]),
  childrenNotes: z.array(BasicNoteSchema),
});
