import { useCallback, useState } from 'react';
import { useApproveEndUserMutation } from '@/lib/react-query/mutations/useApproveEndUserMutation/useApproveEndUserMutation';
import { useRejectEndUserMutation } from '@/lib/react-query/mutations/useRejectEndUserMutation/useRejectEndUserMutation';
import { useEndUserWithWorkflowQuery } from '@/lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { useDebounce } from '@/hooks/useDebounce/useDebounce';
import { useDocumentListener } from '@/hooks/useDocumentListener/useDocumentListener';
import { useSelectNextEndUser } from '@/hooks/useSelectNextEndUser/useSelectNextEndUser';
import { createInitials } from '@/utils/create-initials/create-initials';
import { IUseActions } from './interfaces';
import { Action } from '@/enums';

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
  const isLoading = isLoadingApproveEndUser || isLoadingRejectEndUser || isLoadingEndUser;
  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  const canReject = workflow?.nextEvents.includes(Action.REJECT.toLowerCase()) as boolean;
  const canApprove = workflow?.nextEvents.includes(Action.APPROVE.toLowerCase()) as boolean;

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectEndUser = useDebounce(isLoadingRejectEndUser, 300);
  const debouncedIsLoadingApproveEndUser = useDebounce(isLoadingApproveEndUser, 300);

  // Avoid passing the onClick event to mutate
  const onMutateApproveEndUser = useCallback(() => mutateApproveEndUser(), [mutateApproveEndUser]);
  const onMutateRejectEndUser = useCallback(
    (payload: Parameters<typeof mutateRejectEndUser>[0]) => () => mutateRejectEndUser(payload),
    [mutateRejectEndUser],
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
  const workflows = endUser?.workflows;

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
    debouncedIsLoadingRejectEndUser,
    debouncedIsLoadingApproveEndUser,
    isLoading,
    isLoadingEndUser,
    initials,
    canReject,
    canApprove,
    documentToResubmit,
    resubmissionReason,
    onDocumentToResubmitChange,
    onResubmissionReasonChange,
  };
};
