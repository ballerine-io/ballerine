import { z } from 'zod';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';

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
  noteableType: 'Report' | 'Alert' | 'Workflow';
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
