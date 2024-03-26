import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowDefinitionByIdQuery } from '@/domains/workflow-definitions/hooks/queries/useWorkflowDefinitionByQuery/useWorkflowDefinitionByIdQuery';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { getProcessTrackerProcesses } from '@/pages/Entity/hooks/useCurrentCase/utils/get-process-tracker-processes';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const useCurrentCase = () => {
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

  const processTrackerProcesses = useMemo(() => getProcessTrackerProcesses(workflow), [workflow]);

  return {
    selectedEntity,
    workflow,
    plugins,
    processTrackerProcesses,
  };
};
