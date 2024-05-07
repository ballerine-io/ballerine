import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useApproveCaseMutation } from '@/domains/entities/hooks/mutations/useApproveCaseMutation/useApproveCaseMutation';
import { useRejectCaseMutation } from '@/domains/entities/hooks/mutations/useRejectCaseMutation/useRejectCaseMutation';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { StateTag } from '@ballerine/common';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useWebsiteMonitoringCaseActionsLogic = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user;
  const caseState = useCaseState(authenticatedUser, workflow);

  const { mutate: onMutateApproveEntity, isLoading: isApproveCaseLoading } = useApproveCaseMutation(
    { workflowId: workflow?.id as string },
  );
  const { mutate: onMutateRejectEntity, isLoading: isRejectCaseLoading } = useRejectCaseMutation({
    workflowId: workflow?.id as string,
  });

  const [formValues, setValues] = useState({
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

      return;
    }

    if (formValues.action === 'suspend') {
      onMutateRejectEntity();

      return;
    }

    toast.error(`Action: ${String(formValues.action)} is unsupported.`);
  }, [formValues, onMutateApproveEntity, onMutateRejectEntity]);

  const isActionsDisabled =
    !workflow?.tags?.includes(StateTag.MANUAL_REVIEW) || !caseState.actionButtonsEnabled;

  return {
    formValues,
    isLoading: isApproveCaseLoading || isRejectCaseLoading,
    isActionsDisabled,
    handleResolutionActionChange,
    handleResolutionCommentChange,
    handleSubmit,
  };
};
