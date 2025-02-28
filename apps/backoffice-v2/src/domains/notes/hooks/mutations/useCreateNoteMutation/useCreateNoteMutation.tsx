import { t } from 'i18next';
import { toast } from 'sonner';
import { isObject } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { createNote } from '@/domains/notes/hooks/fetchers';
import { TNoteableType } from '@/domains/notes/types';
import { notesQueryKey } from '../../query-keys';

export const useCreateNoteMutation = ({
  onSuccess,
  disableToast = false,
}: {
  onSuccess?: <TData>(data: TData) => void;
  disableToast?: boolean;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityId,
      entityType,
      noteableId,
      noteableType,
      content,
      parentNoteId,
    }: {
      entityId: string;
      entityType: 'Business' | 'EndUser';
      noteableId: string;
      noteableType: TNoteableType;
      content: string;
      parentNoteId: string | null;
    }) =>
      createNote({
        entityId,
        entityType,
        noteableId,
        noteableType,
        content,
        parentNoteId,
      }),
    onSuccess: (data, { noteableId, noteableType }) => {
      void queryClient.invalidateQueries(
        notesQueryKey.byNoteable({ noteableId, noteableType }).queryKey,
      );

      if (!disableToast) {
        toast.success(t(`toast:note_created.success`));
      }

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:note_created.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
