import { t } from 'i18next';
import { toast } from 'sonner';
import type { UpdateableAssessmentStatus } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { HttpError } from '@/common/errors/http-error';
import { updateAssessmentStatus } from '../../fetchers';

export const useUpdateAssessmentStatus = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: Awaited<ReturnType<typeof updateAssessmentStatus>>) => void;
  onError?: (error: unknown) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      status,
      assessmentId,
    }: {
      assessmentId?: string;
      status?: UpdateableAssessmentStatus;
    }) => {
      if (!assessmentId || !status) {
        return;
      }

      return await updateAssessmentStatus({ assessmentId, status });
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();

      toast.success(t(`toast:assessment_status_update.success`));
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error(t(`toast:assessment_status_update.error`));
      onError?.(error);
    },
  });
};
