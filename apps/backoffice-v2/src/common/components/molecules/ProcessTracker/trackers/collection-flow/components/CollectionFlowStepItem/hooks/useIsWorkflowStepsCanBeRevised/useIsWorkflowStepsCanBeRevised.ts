import { useIsAssignedToMe } from '@/common/hooks/useIsAssignedToMe';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { StateTag } from '@ballerine/common';
import { useMemo } from 'react';

export interface IUseIsWorkflowStepsCanBeRevisedProps {
  workflowAssigneeId: string | undefined;
  workflowConfig?: TWorkflowById['workflowDefinition']['config'];
  workflowTags: TWorkflowById['tags'];
}

export const useIsWorkflowStepsCanBeRevised = ({
  workflowAssigneeId,
  workflowConfig,
  workflowTags,
}: IUseIsWorkflowStepsCanBeRevisedProps) => {
  const isAssignedToMe = useIsAssignedToMe({ assigneeId: workflowAssigneeId || '' });

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
