import { createQueryKeys } from '@lukemorales/query-key-factory';

import { NoteableType } from '@/pages/Entity/components/Notes/types';
import { getNotesByNotable } from '@/pages/Entity/components/Notes/hooks/fetchers';

export const notesQueryKey = createQueryKeys('notes', {
  byNoteable: ({
    noteableType,
    noteableId,
  }: {
    noteableType: NoteableType;
    noteableId: string;
  }) => ({
    queryKey: [{ noteableType, noteableId }],
    queryFn: () => getNotesByNotable({ noteableType, noteableId }),
  }),
});
