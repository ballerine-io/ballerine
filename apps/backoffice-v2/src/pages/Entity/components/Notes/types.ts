import { z } from 'zod';

import { NoteSchema, NotesSchema } from './hooks/schemas/note-schema';

export type NoteableType = 'Report' | 'Alert' | 'Workflow';

export type TNote = z.infer<typeof NoteSchema>;

export type TNotes = z.infer<typeof NotesSchema>;
