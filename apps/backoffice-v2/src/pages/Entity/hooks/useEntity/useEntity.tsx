import { useParams } from 'react-router-dom';
import { useFilterId } from '../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useTasks } from '../useTasks/useTasks';
import { UiSchemaVariant, uiSchemaVariantToBlocksMap } from '@/lib/blocks/variants/constants';

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
  const kycChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'individual',
  );
  const kybChildWorkflows = workflow?.childWorkflows?.filter(
    childWorkflow => childWorkflow?.context?.entity?.type === 'business',
  );
  const BlocksByUiSchemaVariant =
    uiSchemaVariantToBlocksMap[UiSchemaVariant.KYB_MANUAL_REVIEW_LEGACY];

  return {
    workflow,
    selectedEntity,
    tasks,
    isLoading,
    BlocksByUiSchemaVariant,
  };
};
