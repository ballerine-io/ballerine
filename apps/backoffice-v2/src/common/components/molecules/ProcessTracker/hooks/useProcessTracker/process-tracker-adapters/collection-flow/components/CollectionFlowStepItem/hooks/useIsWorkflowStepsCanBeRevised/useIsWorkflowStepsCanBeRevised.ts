import { CaseState } from '@/common/enums';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { StateTag } from '@ballerine/common';
import { useMemo } from 'react';

export const useIsWorkflowStepsCanBeRevised = (workflow: TWorkflowById) => {
  const { data: session, isLoading } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user || null, workflow);

  const isCanRequestSteps = useMemo(() => {
    if (!workflow?.workflowDefinition.config?.isCollectionFlowPageRevisionEnabled || isLoading) {
      return false;
    }

    const isAssignedToMe = caseState === CaseState.ASSIGNED_TO_ME;

    return (
      isAssignedToMe &&
      workflow?.tags?.some(tag => [StateTag.MANUAL_REVIEW, StateTag.PENDING_PROCESS].includes(tag))
    );
  }, [caseState, workflow, isLoading]);

  return isCanRequestSteps;
};
