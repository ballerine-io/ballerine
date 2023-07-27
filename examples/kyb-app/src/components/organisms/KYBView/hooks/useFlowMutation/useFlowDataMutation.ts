import { updateFlowData } from '@app/domains/workflows';

export const useFlowDataMutation = () => {
  return {
    mutate: updateFlowData,
  };
};
