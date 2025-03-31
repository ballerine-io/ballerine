import { TWorkflowById } from '@/domains/workflows/fetchers';
import { CollectionFlowStepStatesEnum, TCollectionFlowStep } from '@ballerine/common';
import { useMemo } from 'react';
import { useIsWorkflowStepsCanBeRevised } from '../useIsWorkflowStepsCanBeRevised';
import { TAuthenticatedUser } from '@/domains/auth/types';

interface IUseIsCurrentStepCanBeRevisedProps {
  authenticatedUser: TAuthenticatedUser;
  workflowConfig: TWorkflowById['workflowDefinition']['config'];
  workflowAssigneeId: string | undefined;
  workflowTags: TWorkflowById['tags'];
  step: TCollectionFlowStep;
}

export const useIsCurrentStepCanBeRevised = ({
  authenticatedUser,
  workflowConfig,
  workflowAssigneeId,
  workflowTags,
  step,
}: IUseIsCurrentStepCanBeRevisedProps) => {
  const isWorkflowStepsCanBeRevised = useIsWorkflowStepsCanBeRevised({
    authenticatedUser,
    workflowAssigneeId,
    workflowConfig,
    workflowTags,
  });

  const isCurrentStepCanBeRevised = useMemo(() => {
    return [CollectionFlowStepStatesEnum.completed, CollectionFlowStepStatesEnum.revision].includes(
      step.state,
    );
  }, [step.state]);

  return isWorkflowStepsCanBeRevised && isCurrentStepCanBeRevised;
};
