import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { TNoteableType } from '@/domains/notes/types';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { NoteSchema, NotesSchema } from '@/domains/notes/hooks/schemas/note-schema';

export const createNote = async ({
  entityId,
  entityType,
  noteableId,
  noteableType,
  content,
  parentNoteId = null,
}: {
  entityId: string;
  entityType: 'Business' | 'EndUser';
  noteableId: string;
  noteableType: TNoteableType;
  content: string;
  parentNoteId: string | null;
}) => {
  const [note, error] = await apiClient({
    endpoint: `../external/notes`,
    method: Method.POST,
    schema: NoteSchema,
    body: {
      entityId,
      entityType,
      noteableId,
      noteableType,
      content,
      parentNoteId,
    },
  });

  return handleZodError(error, note);
};

export const getNotesByNotable = async ({
  noteableId,
  noteableType,
}: {
  noteableId: string;
  noteableType: TNoteableType;
}) => {
  const [note, error] = await apiClient({
    endpoint: `../external/notes/${noteableType}/${noteableId}`,
    method: Method.GET,
    schema: NotesSchema,
  });

  return handleZodError(error, note);
};
