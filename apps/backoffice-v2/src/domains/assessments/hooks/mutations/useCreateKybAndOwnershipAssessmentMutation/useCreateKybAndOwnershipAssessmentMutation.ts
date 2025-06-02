import { t } from 'i18next';
import { toast } from 'sonner';
import { isObject } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import {
  createKybAndOwnershipAssessment,
  TCreateKybAndOwnershipAssessmentPayload as TCreateKybAndOwnershipAssessmentPayload,
} from '@/domains/assessments/fetchers';

export const useCreateKybAndOwnershipAssessmentMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(data: TData) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateKybAndOwnershipAssessmentPayload) => {
      await createKybAndOwnershipAssessment(payload);
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:kyb_and_ownership_assessment_creation.success`));

      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(
        t(`toast:kyb_and_ownership_assessment_creation.error`, {
          errorMessage: isObject(error) && 'message' in error ? error.message : error,
        }),
      );
    },
  });
};
