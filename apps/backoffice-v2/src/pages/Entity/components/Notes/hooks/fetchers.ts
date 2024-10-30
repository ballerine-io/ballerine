import { z } from 'zod';

import { Method } from '@/common/enums';
import { apiClient } from '@/common/api-client/api-client';
import { NoteableType } from '@/pages/Entity/components/Notes/types';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { NoteSchema } from '@/pages/Entity/components/Notes/hooks/schemas/note-schema';

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
  noteableType: NoteableType;
  content: string;
  parentNoteId: string | null;
}) => {
  const [note, error] = await apiClient({
    endpoint: `../external/notes`,
    method: Method.POST,
    schema: z.undefined(),
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
  noteableType: NoteableType;
}) => {
  const [note, error] = await apiClient({
    endpoint: `../external/notes/${noteableType}/${noteableId}`,
    method: Method.GET,
    schema: z.array(NoteSchema),
  });

  return handleZodError(error, note);
};
