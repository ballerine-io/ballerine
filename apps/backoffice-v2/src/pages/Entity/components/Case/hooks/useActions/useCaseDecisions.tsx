import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useApproveEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveEntityMutation/useApproveEntityMutation';
import { useRejectEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectEntityMutation/useRejectEntityMutation';
import { useDebounce } from '../../../../../../common/hooks/useDebounce/useDebounce';
import { useCallback, useState } from 'react';
import { ResubmissionReason } from './useActionsLogic';

export const useCaseDecisions = ({
  workflowId,
  workflow,
  onSelectNextEntity,
}: {
  workflowId: string;
  workflow: ReturnType<typeof useWorkflowQuery>['data'];
  onSelectNextEntity: () => void;
}) => {
  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
  const caseState = useCaseState(authenticatedUser, workflow);
  const { mutate: mutateApproveEntity, isLoading: isLoadingApproveEntity } =
    useApproveEntityMutation({
      workflowId: workflowId,
      onSelectNextEntity,
    });
  const { mutate: mutateRejectEntity, isLoading: isLoadingRejectEntity } = useRejectEntityMutation({
    workflowId: workflowId,
    onSelectNextEntity,
  });
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  // TODO: Supposed to be based on `nextEvents` and for the global case actions (not per document)
  const canReject = caseState.actionButtonsEnabled;
  const canApprove = caseState.actionButtonsEnabled;
  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectEntity = useDebounce(isLoadingRejectEntity, 300);
  const debouncedIsLoadingApproveEntity = useDebounce(isLoadingApproveEntity, 300);
  // Avoid passing the onClick event to mutate
  const onMutateApproveEntity = useCallback(() => mutateApproveEntity(), [mutateApproveEntity]);
  const onMutateRejectEntity = useCallback(
    (payload: Parameters<typeof mutateRejectEntity>[0]) => () => mutateRejectEntity(payload),
    [mutateRejectEntity],
  );
  const [documentToResubmit, setDocumentToResubmit] = useState('id');
  const onDocumentToResubmitChange = useCallback(
    (value: string) => setDocumentToResubmit(value),
    [setDocumentToResubmit],
  );
  const [resubmissionReason, setResubmissionReason] = useState<keyof typeof ResubmissionReason>();
  const onResubmissionReasonChange = useCallback(
    (value: string) => setResubmissionReason(value as keyof typeof ResubmissionReason),
    [setResubmissionReason],
  );
  const isActionButtonDisabled = !caseState.actionButtonsEnabled;

  return {
    caseState,
    isActionButtonDisabled,
    canReject,
    canApprove,
    onMutateApproveEntity,
    onMutateRejectEntity,
    documentToResubmit,
    resubmissionReason,
    onDocumentToResubmitChange,
    onResubmissionReasonChange,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingApproveEntity,
    isLoadingApproveEntity,
    isLoadingRejectEntity,
  };
};
