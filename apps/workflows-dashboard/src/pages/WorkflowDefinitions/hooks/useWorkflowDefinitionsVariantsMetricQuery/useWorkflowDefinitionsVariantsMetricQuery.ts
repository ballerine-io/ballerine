import { workflowDefinitionMetricKeys } from '@/domains/workflow-definitions';
import { useQuery } from '@tanstack/react-query';

export const useWorkflowDefinitionsVariantsMetricQuery = () => {
  const { data, isLoading } = useQuery({
    ...workflowDefinitionMetricKeys.workflowDefinitionVariantMetrics(),
    //@ts-ignore
    enabled: true,
  });

  return {
    data,
    isLoading,
  };
};
