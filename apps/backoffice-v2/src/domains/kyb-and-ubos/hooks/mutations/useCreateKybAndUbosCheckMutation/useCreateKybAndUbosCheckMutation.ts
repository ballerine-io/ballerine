import { t } from 'i18next';
import { toast } from 'sonner';
import { isObject } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import {
  createKybAndUbosCheck,
  TCreateKybAndUbosCheckPayload,
} from '@/domains/kyb-and-ubos/fetchers';

export const useCreateKybAndUbosCheckMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateKybAndUbosCheckPayload) => {
      await createKybAndUbosCheck(payload);
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:kyb_and_ubos_check_creation.success`));

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:kyb_and_ubos_check_creation.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
