import { useCallback, useState } from 'react';
import { useApproveEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveEntityMutation/useApproveEntityMutation';
import { useDebounce } from '../../../../../../common/hooks/useDebounce/useDebounce';
import { createInitials } from '../../../../../../common/utils/create-initials/create-initials';
import { IUseActions } from './interfaces';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useUsersQuery } from '../../../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useAssignWorkflowMutation } from '../../../../../../domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useRejectEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectEntityMutation/useRejectEntityMutation';
import { useSelectNextEntity } from '../../../../../../domains/entities/hooks/useSelectNextEntity/useSelectNextEntity';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { CaseState } from '../../../../../../common/enums';

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

export const useActionsLogic = ({ workflowId, fullName }: IUseActions) => {
  // <Current entity>
  const filterId = useFilterId();
  const onSelectNextEntity = useSelectNextEntity();
  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);
  const { data: workflow, isLoading: isLoadingEntity } = useWorkflowQuery({ workflowId, filterId });
  // </Current entity>

  // <Authenticated user>
  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
  // </Authenticated user>

  // <Case decisions>
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
  // </Case decisions>

  // <Assignment>
  const { data: users } = useUsersQuery();
  const assigneesWithoutMe = users?.filter(assignee => assignee?.id !== authenticatedUser?.id);
  const isAssignedToMe = authenticatedUser?.id === workflow?.assignee?.id;
  const { mutate: mutateAssignWorkflow, isLoading: isLoadingAssignWorkflow } =
    useAssignWorkflowMutation({ workflowRuntimeId: workflowId, isAssignedToMe });
  const debouncedIsLoadingAssignEntity = useDebounce(isLoadingAssignWorkflow, 300);
  const isAssignToMeDisabled = !caseState.assignToMeEnabled;
  const isAssignToOtherDisabled = !caseState.assignToOtherEnabled;
  const isUnassignDisabled = caseState === CaseState.UNASSIGNED;
  const onAssignMe = useCallback(
    () =>
      mutateAssignWorkflow({
        assigneeId: authenticatedUser?.id,
      }),
    [mutateAssignWorkflow, authenticatedUser?.id],
  );
  const onUnassign = useCallback(
    () =>
      mutateAssignWorkflow({
        assigneeId: null,
      }),
    [mutateAssignWorkflow],
  );
  const onAssign = useCallback(
    (assigneeId: string) => () =>
      mutateAssignWorkflow({
        assigneeId,
      }),
    [mutateAssignWorkflow],
  );
  // </Assignment>

  const isLoading = isLoadingApproveEntity || isLoadingRejectEntity || isLoadingAssignWorkflow;

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
    // <Authenticated user>
    authenticatedUser,
    // </Authenticated user>

    // <Current entity>
    initials,
    isLoadingEntity,
    // </Current entity>

    // <Case decisions>
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
    // </Case decisions>

    // <Assignment>
    assigneesWithoutMe,
    isAssignToMeDisabled,
    isAssignToOtherDisabled,
    isUnassignDisabled,
    onAssign,
    onAssignMe,
    onUnassign,
    debouncedIsLoadingAssignEntity,
    // </Assignment>

    isLoading,
  };
};
