import { useCallback, useState } from 'react';
import { useApproveEndUserMutation } from '../../../../../lib/react-query/mutations/useApproveEndUserMutation/useApproveEndUserMutation';
import { useRejectEndUserMutation } from '../../../../../lib/react-query/mutations/useRejectEndUserMutation/useRejectEndUserMutation';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { useDebounce } from 'hooks/useDebounce/useDebounce';
import { useDocumentListener } from 'hooks/useDocumentListener/useDocumentListener';
import { useSelectNextEndUser } from 'hooks/useSelectNextEndUser/useSelectNextEndUser';
import { createInitials } from '../../../../../utils/create-initials/create-initials';
import { IUseActions } from './interfaces';
import { Action, CaseState } from '../../../../../enums';
import { TAuthenticatedUser, TCaseManagementState } from '../../../../../api/types';
import { useGetSessionQuery } from '../../../../../lib/react-query/queries/useGetSessionQuery/useGetSessionQuery';
import { useCaseState } from 'components/organisms/Subject/hooks/useCaseState/useCaseState';
import { useAssignWorkflowMutation } from '../../../../../lib/react-query/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useUsersQuery } from '../../../../../lib/react-query/queries/useUsersQuery/useUsersQuery';

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

export const useActions = ({ endUserId, fullName }: IUseActions) => {
  const onSelectNextEndUser = useSelectNextEndUser();
  const { isLoading: isLoadingEndUser, data: endUser } = useEndUserWithWorkflowQuery(endUserId);
  const { workflow } = endUser ?? {};
  const { mutate: mutateApproveEndUser, isLoading: isLoadingApproveEndUser } =
    useApproveEndUserMutation({
      endUserId,
      workflowId: workflow?.runtimeDataId,
      onSelectNextEndUser,
    });
  const { mutate: mutateRejectEndUser, isLoading: isLoadingRejectEndUser } =
    useRejectEndUserMutation({
      endUserId,
      workflowId: workflow?.runtimeDataId,
      onSelectNextEndUser,
    });

  const { mutate: mutateAssignWorkflow, isLoading: isLoadingAssignWorkflow } =
    useAssignWorkflowMutation({ workflowRuntimeId: workflow?.runtimeDataId });

  const isLoading =
    isLoadingApproveEndUser ||
    isLoadingRejectEndUser ||
    isLoadingEndUser ||
    isLoadingAssignWorkflow;
  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);

  const {
    data: { user },
  } = useGetSessionQuery();
  const authenticatedUser = user;
  const caseState = useCaseState(authenticatedUser, workflow);
  const { data: users } = useUsersQuery();
  const assignees = users.filter(assignee => assignee.id !== authenticatedUser.id);
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  const canReject =
    (workflow?.nextEvents.includes(Action.REJECT.toLowerCase()) as boolean) &&
    caseState.actionButtonsEnabled;
  const canApprove =
    (workflow?.nextEvents.includes(Action.APPROVE.toLowerCase()) as boolean) &&
    caseState.actionButtonsEnabled;

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectEndUser = useDebounce(isLoadingRejectEndUser, 300);
  const debouncedIsLoadingApproveEndUser = useDebounce(isLoadingApproveEndUser, 300);
  const debouncedIsLoadingAssignEndUser = useDebounce(isLoadingAssignWorkflow, 300);

  // Avoid passing the onClick event to mutate
  const onMutateApproveEndUser = useCallback(() => mutateApproveEndUser(), [mutateApproveEndUser]);
  const onMutateRejectEndUser = useCallback(
    (payload: Parameters<typeof mutateRejectEndUser>[0]) => () => mutateRejectEndUser(payload),
    [mutateRejectEndUser],
  );
  const onMutateAssignWorkflow = useCallback(
    (assigneeId: string, isAssignedToMe: boolean) =>
      mutateAssignWorkflow({
        assigneeId,
        isAssignedToMe,
      }),
    [mutateAssignWorkflow],
  );
  const [documentToResubmit, setDocumentToResubmit] = useState('documentOne');
  const onDocumentToResubmitChange = useCallback(
    (value: string) => setDocumentToResubmit(value),
    [setDocumentToResubmit],
  );
  const [resubmissionReason, setResubmissionReason] = useState<keyof typeof ResubmissionReason>();
  const onResubmissionReasonChange = useCallback(
    (value: string) => setResubmissionReason(value as keyof typeof ResubmissionReason),
    [setResubmissionReason],
  );

  useDocumentListener('keydown', event => {
    if (!event.ctrlKey || document.activeElement !== document.body) return;

    event.preventDefault();

    switch (event.key) {
      case 'ArrowDown':
        onSelectNextEndUser();
        break;

      // Approve end user on 'Ctrl + A'
      case 'a':
        onMutateApproveEndUser();
        break;

      // Reject end user on 'Ctrl + J'
      case 'j':
        onMutateRejectEndUser({
          action: Action.REJECT,
        });
        break;
    }
  });

  return {
    onMutateApproveEndUser,
    onMutateRejectEndUser,
    onMutateAssignWorkflow,
    debouncedIsLoadingRejectEndUser,
    debouncedIsLoadingApproveEndUser,
    debouncedIsLoadingAssignEndUser,
    isLoading,
    isLoadingEndUser,
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
