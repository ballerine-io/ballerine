import { IUseActions } from '@/pages/Entity/components/Case/hooks/useCaseActionsLogic/interfaces';
import { useCaseActionsLogic } from '@/pages/Entity/components/Case/hooks/useCaseActionsLogic/useCaseActionsLogic';
import { StateTag } from '@ballerine/common';
import { useCallback, useState } from 'react';

export interface IResolutionActionsFormValues {
  action: string;
  comment: string;
}

export const useWebsiteMonitoringCaseActions = ({ workflowId: id, fullName }: IUseActions) => {
  const {
    tag,
    assignedUser,
    authenticatedUser,
    isLoadingCase,
    assignees,
    isLoading,
    workflow,
    isActionButtonDisabled,
    onMutateRejectEntity,
    onMutateApproveEntity,
    onMutateAssignWorkflow,
  } = useCaseActionsLogic({ workflowId: id, fullName });

  const [formValues, setValues] = useState<IResolutionActionsFormValues>({
    action: '',
    comment: '',
  });

  const handleResolutionActionChange = useCallback(
    (value: string) => setValues(prev => ({ ...prev, action: value })),
    [],
  );

  const handleResolutionCommentChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prev => ({ ...prev, comment: event.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (formValues.action === 'resolved') {
      onMutateApproveEntity();
    }

    if (formValues.action === 'suspend') {
      onMutateRejectEntity();
    }
  }, [formValues, onMutateApproveEntity, onMutateRejectEntity]);

  const isActionsDisabled =
    !workflow?.tags?.includes(StateTag.MANUAL_REVIEW) || isActionButtonDisabled;

  return {
    tag,
    assignedUser,
    authenticatedUser,
    isLoadingCase,
    assignees,
    formValues,
    isLoading,
    isActionsDisabled,
    onMutateAssignWorkflow,
    handleResolutionActionChange,
    handleResolutionCommentChange,
    handleSubmit,
  };
};
