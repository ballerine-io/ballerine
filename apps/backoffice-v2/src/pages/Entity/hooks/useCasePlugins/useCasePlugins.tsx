import { useWorkflowDefinitionByIdQuery } from '@/domains/workflow-definitions/hooks/queries/useWorkflowDefinitionByQuery/useWorkflowDefinitionByIdQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useMemo } from 'react';

export const useCasePlugins = ({ workflow }: { workflow?: TWorkflowById }) => {
  const { data: workflowDefinition } = useWorkflowDefinitionByIdQuery({
    workflowDefinitionId: workflow?.workflowDefinition?.id ?? '',
  });

  const plugins = useMemo(
    () => [
      ...(workflowDefinition?.extensions?.apiPlugins ?? []),
      ...(workflowDefinition?.extensions?.childWorkflowPlugins ?? []),
      ...(workflowDefinition?.extensions?.commonPlugins ?? []),
    ],
    [workflowDefinition],
  );

  return plugins;
};
