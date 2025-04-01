import { TAuthenticatedUser } from '@/domains/auth/types';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { StateTag } from '@ballerine/common';
import { useMemo } from 'react';

export interface IUseIsWorkflowStepsCanBeRevisedProps {
  authenticatedUser: TAuthenticatedUser;
  workflowAssigneeId: string | undefined;
  workflowConfig?: TWorkflowById['workflowDefinition']['config'];
  workflowTags: TWorkflowById['tags'];
}

export const useIsWorkflowStepsCanBeRevised = ({
  authenticatedUser,
  workflowAssigneeId,
  workflowConfig,
  workflowTags,
}: IUseIsWorkflowStepsCanBeRevisedProps) => {
  const isAssignedToMe = useMemo(() => {
    if (!authenticatedUser || !workflowAssigneeId) {
      return false;
    }

    return workflowAssigneeId === authenticatedUser.id;
  }, [authenticatedUser, workflowAssigneeId]);

  const isCanRequestSteps = useMemo(() => {
    if (!workflowConfig?.isCollectionFlowPageRevisionEnabled) {
      return false;
    }

    return (
      isAssignedToMe &&
      workflowTags?.some(tag => [StateTag.MANUAL_REVIEW, StateTag.PENDING_PROCESS].includes(tag))
    );
  }, [isAssignedToMe, workflowTags, workflowConfig]);

  return isCanRequestSteps;
};
