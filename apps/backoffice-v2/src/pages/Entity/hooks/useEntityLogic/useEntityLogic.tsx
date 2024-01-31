import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useWorkflowDefinitionByIdQuery } from '@/domains/workflow-definitions/hooks/queries/useWorkflowDefinitionByQuery/useWorkflowDefinitionByIdQuery';

export const useEntityLogic = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowByIdQuery({
    workflowId: entityId ?? '',
    filterId: filterId ?? '',
  });
  const { data: workflowDefinition } = useWorkflowDefinitionByIdQuery({
    workflowDefinitionId: workflow?.workflowDefinition?.id ?? '',
  });
  const selectedEntity = workflow?.entity;
  const plugins = [
    ...(workflowDefinition?.extensions?.apiPlugins ?? []),
    ...(workflowDefinition?.extensions?.childWorkflowPlugins ?? []),
    ...(workflowDefinition?.extensions?.commonPlugins ?? []),
  ];

  return {
    selectedEntity,
    workflow,
    plugins,
  };
};
