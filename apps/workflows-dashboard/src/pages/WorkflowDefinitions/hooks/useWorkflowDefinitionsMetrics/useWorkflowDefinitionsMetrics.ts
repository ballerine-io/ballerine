import { WFDefinitionByVariantChart } from '@/pages/WorkflowDefinitions/components/molecules/WFDefinitionByVariantChart';
import { useWorkflowDefinitionsVariantsMetricQuery } from '@/pages/WorkflowDefinitions/hooks/useWorkflowDefinitionsVariantsMetricQuery';
import { getRandomBrightHexColor } from '@/utils/get-random-bright-hex-color';
import { useMemo } from 'react';

export const useWorkflowDefinitionsMetrics = () => {
  const { data, isLoading } = useWorkflowDefinitionsVariantsMetricQuery();

  const metricsByVariant: WFDefinitionByVariantChart[] = useMemo(() => {
    if (isLoading || !data) return [];

    return data.map(({ workflowDefinitionVariant, count }) => ({
      variantName: workflowDefinitionVariant,
      count,
      fillColor: getRandomBrightHexColor(),
    }));
  }, [isLoading, data]);

  return {
    metricsByVariant: {
      isLoading,
      data: metricsByVariant,
    },
  };
};
