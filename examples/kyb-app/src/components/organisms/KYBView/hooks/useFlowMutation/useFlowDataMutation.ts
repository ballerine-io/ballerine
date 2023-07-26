import { updateFlowData } from '@app/domains/workflows';
import { useMutation } from '@tanstack/react-query';

export const useFlowDataMutation = () => {
  const { mutate, isLoading } = useMutation({ mutationFn: updateFlowData });

  return {
    mutate,
    isLoading,
  };
};
