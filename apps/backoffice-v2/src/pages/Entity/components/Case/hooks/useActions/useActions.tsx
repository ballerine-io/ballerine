import { useCallback, useState } from 'react';
import { useApproveEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveEntityMutation/useApproveEntityMutation';
import { useDebounce } from '../../../../../../common/hooks/useDebounce/useDebounce';
import { createInitials } from '../../../../../../common/utils/create-initials/create-initials';
import { Action } from '../../../../../../common/enums';
import { IUseActions } from './interfaces';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useUsersQuery } from '../../../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useAssignWorkflowMutation } from '../../../../../../domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useRejectEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectEntityMutation/useRejectEntityMutation';
import { useSelectNextEntity } from '../../../../../../domains/entities/hooks/useSelectNextEntity/useSelectNextEntity';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';

export const ResubmissionReason = {
  BLURRY_IMAGE: 'BLURRY_IMAGE',
  CUT_IMAGE: 'CUT_IMAGE',
  UNSUPPORTED_DOCUMENT: 'UNSUPPORTED_DOCUMENT',
  DAMAGED_DOCUMENT: 'DAMAGED_DOCUMENT',
  EXPIRED_DOCUMENT: 'EXPIRED_DOCUMENT',
  COPY_OF_A_COPY: 'COPY_OF_A_COPY',
  FACE_IS_UNCLEAR: 'FACE_IS_UNCLEAR',
  FACE_IS_NOT_MATCHING: 'FACE_IS_NOT_MATCHING',
} as const;

export const useActions = ({ workflowId, fullName }: IUseActions) => {
  const onSelectNextEntity = useSelectNextEntity();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId, filterId });
  const { mutate: mutateApproveEntity, isLoading: isLoadingApproveEntity } =
    useApproveEntityMutation({
      workflowId: workflowId,
      onSelectNextEntity,
    });
  const { mutate: mutateRejectEntity, isLoading: isLoadingRejectEntity } = useRejectEntityMutation({
    workflowId: workflowId,
    onSelectNextEntity,
  });

  const { mutate: mutateAssignWorkflow, isLoading: isLoadingAssignWorkflow } =
    useAssignWorkflowMutation({ workflowRuntimeId: workflowId });

  const isLoading = isLoadingApproveEntity || isLoadingRejectEntity || isLoadingAssignWorkflow;
  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);

  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
  const caseState = useCaseState(authenticatedUser, workflow);
  const { data: users } = useUsersQuery();
  const assignees = users?.filter(assignee => assignee?.id !== authenticatedUser?.id);
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  const canReject = caseState.actionButtonsEnabled;
  const canApprove = caseState.actionButtonsEnabled;

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectEntity = useDebounce(isLoadingRejectEntity, 300);
  const debouncedIsLoadingApproveEntity = useDebounce(isLoadingApproveEntity, 300);
  const debouncedIsLoadingAssignEntity = useDebounce(isLoadingAssignWorkflow, 300);

  // Avoid passing the onClick event to mutate
  const onMutateApproveEntity = useCallback(() => mutateApproveEntity(), [mutateApproveEntity]);
  const onMutateRejectEntity = useCallback(
    (payload: Parameters<typeof mutateRejectEntity>[0]) => () => mutateRejectEntity(payload),
    [mutateRejectEntity],
  );
  const onMutateAssignWorkflow = useCallback(
    (assigneeId: string, isAssignedToMe: boolean) =>
      mutateAssignWorkflow({
        assigneeId,
        isAssignedToMe,
      }),
    [mutateAssignWorkflow],
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
  const onTriggerAssignToMe = true;

  // useDocumentListener('keydown', event => {
  //   if (!event.ctrlKey || document.activeElement !== document.body) return;
  //
  //   event.preventDefault();
  //
  //   switch (event.key) {
  //     case 'ArrowDown':
  //       onSelectNextEntity();
  //       break;
  //
  //     // Approve end user on 'Ctrl + A'
  //     case 'a':
  //       onMutateApproveEntity();
  //       break;
  //
  //     // Reject end user on 'Ctrl + J'
  //     case 'j':
  //       onMutateRejectEntity({
  //         action: Action.REJECT,
  //       });
  //       break;
  //   }
  // });

  return {
    onTriggerAssignToMe,
    isActionButtonDisabled,
    onMutateApproveEntity,
    onMutateRejectEntity,
    onMutateAssignWorkflow,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingAssignEntity,
    isLoading,
    initials,
    canReject,
    canApprove,
    documentToResubmit,
    resubmissionReason,
    onDocumentToResubmitChange,
    onResubmissionReasonChange,
    caseState,
    authenticatedUser,
    assignees,
  };
};
