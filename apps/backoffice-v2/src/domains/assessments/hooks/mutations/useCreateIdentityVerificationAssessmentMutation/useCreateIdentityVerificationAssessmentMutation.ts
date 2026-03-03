import { isObject } from '@ballerine/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { HttpError } from '@/common/errors/http-error';
import {
  createIdentityVerificationAssessment,
  TCreateIdentityVerificationAssessmentPayload,
  TCreateIdentityVerificationAssessmentResponse,
} from '@/domains/assessments/fetchers';

export const useCreateIdentityVerificationAssessmentMutation = ({
  onSuccess,
}: {
  onSuccess?: (data: TCreateIdentityVerificationAssessmentResponse) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TCreateIdentityVerificationAssessmentPayload) => {
      const response = await createIdentityVerificationAssessment(payload);

      if (!response) {
        throw new Error('Identity verification assessment creation returned no payload');
      }

      return response;
    },
    onSuccess: data => {
      void queryClient.invalidateQueries();
      toast.success('Identity verification assessment created.');
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);
        return;
      }

      const errorMessage = isObject(error) && 'message' in error ? String(error.message) : '';
      toast.error(
        errorMessage
          ? `Failed to create identity verification assessment: ${errorMessage}`
          : 'Failed to create identity verification assessment.',
      );
    },
  });
};
