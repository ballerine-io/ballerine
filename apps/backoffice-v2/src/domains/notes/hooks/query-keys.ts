import { createQueryKeys } from '@lukemorales/query-key-factory';

import { TNoteableType } from '@/domains/notes/types';
import { getNotesByNotable } from '@/domains/notes/hooks/fetchers';

export const notesQueryKey = createQueryKeys('notes', {
  byNoteable: ({
    noteableType,
    noteableId,
  }: {
    noteableType: TNoteableType;
    noteableId: string;
  }) => ({
    queryKey: [{ noteableType, noteableId }],
    queryFn: () => getNotesByNotable({ noteableType, noteableId }),
  }),
});
