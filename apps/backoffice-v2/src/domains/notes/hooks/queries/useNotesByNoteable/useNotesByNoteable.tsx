import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { useQuery } from '@tanstack/react-query';
import { isString } from '@/common/utils/is-string/is-string';
import { notesQueryKey } from '@/domains/notes/hooks/query-keys';
import { TNoteableType } from '@/domains/notes/types';

export const useNotesByNoteable = ({
  noteableType,
  noteableId = '',
}: {
  noteableType: TNoteableType;
  noteableId?: string;
}) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...notesQueryKey.byNoteable({ noteableType, noteableId }),
    enabled: isAuthenticated && isString(noteableId) && !!noteableId.length,
    staleTime: 100_000,
    refetchInterval: 1_000_000,
  });
};
