import { useParams } from 'react-router-dom';
import { cells } from './cells';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useTasks } from '../useTasks/useTasks';
import { useKycBlocks } from './kycBlock.stories';

export const useEntity = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();

  const { data: workflow, isLoading } = useWorkflowQuery({ workflowId: entityId, filterId });
  const selectedEntity = workflow?.entity;
  const {
    documents: contextDocuments,
    entity: contextEntity,
    pluginsOutput,
  } = workflow?.context ?? {};
  const tasks = useTasks({
    workflow,
    entity: contextEntity,
    documents: contextDocuments,
    pluginsOutput,
    parentMachine: workflow?.context?.parentMachine,
  });
  const childTasks = useKycBlocks(workflow?.childWorkflows) || [];

  return {
    selectedEntity,
    cells,
    tasks: [...tasks, ...childTasks],
    workflow,
    isLoading,
  };
};
