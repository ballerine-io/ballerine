import { z } from 'zod';

const BaseNoteSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  entityType: z.enum(['Business', 'EndUser']),
  noteableId: z.string(),
  noteableType: z.enum(['Report', 'Alert', 'Workflow']),
  content: z.string(),
  fileIds: z.array(z.string()),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
});

export const NoteSchema = BaseNoteSchema.extend({
  parentNote: z.union([BaseNoteSchema, z.null()]),
  childrenNotes: z.array(BaseNoteSchema),
});

export const NotesSchema = z.array(NoteSchema);
