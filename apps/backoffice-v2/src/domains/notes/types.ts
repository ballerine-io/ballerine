import { z } from 'zod';

import { NoteSchema, NotesSchema } from '@/domains/notes/hooks/schemas/note-schema';

export type TNoteableType = 'Report' | 'Alert' | 'Workflow';

export type TNote = z.infer<typeof NoteSchema>;

export type TNotes = z.infer<typeof NotesSchema>;
