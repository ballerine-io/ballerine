import { t } from 'i18next';
import { toast } from 'sonner';
import { isObject } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { createNote } from '@/domains/notes/hooks/fetchers';
import { TNoteableType } from '@/domains/notes/types';

export const useCreateNoteMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(data: TData) => void;
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
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:note_created.success`));

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
