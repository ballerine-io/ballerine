import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { UnknownRecord } from '@/common/types';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '@/domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useDocumentBlocks } from '@/pages/Entity/hooks/useTasks/hooks/useDocumentBlocks/useDocumentBlocks';

export const useChildDocumentBlocksLogic = ({
  parentWorkflowId,
  childWorkflow,
  parentMachine,
}: {
  parentWorkflowId: string;
  childWorkflow: TWorkflowById['childWorkflows'][number];
  parentMachine: UnknownRecord;
}) => {
  const filterId = useFilterId();
  const { data: parentWorkflow } = useWorkflowQuery({
    workflowId: parentWorkflowId,
    filterId,
  });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, parentWorkflow);
  const { noAction } = useCaseDecision();

  const childDocumentBlocks = useDocumentBlocks({
    workflow: childWorkflow,
    parentMachine,
    noAction,
    caseState,
    withEntityNameInHeader: true,
  });

  return childDocumentBlocks;
};
