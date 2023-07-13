import { IUseActionsLogic } from './interfaces';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCurrentEntity } from './useCurrentEntity';
import { useCaseDecisions } from './useCaseDecisions';
import { useAssignment } from './useAssignment';

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

export const useActionsLogic = ({ workflowId, fullName }: IUseActionsLogic) => {
  // Authenticated user
  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
  // /Authenticated user

  // Current entity
  const { isLoadingEntity, initials, workflow, onSelectNextEntity } = useCurrentEntity({
    workflowId,
    fullName,
  });
  // /Current entity

  // Case decisions
  const {
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
  } = useCaseDecisions({
    workflowId,
    workflow,
    onSelectNextEntity,
  });
  // /Case decisions

  // Assignment
  const {
    assigneesWithoutMe,
    isAssignToMeDisabled,
    isAssignToOtherDisabled,
    isUnassignDisabled,
    onAssign,
    onAssignMe,
    onUnassign,
    debouncedIsLoadingAssignEntity,
    isLoadingAssignWorkflow,
  } = useAssignment({
    workflowId,
    workflow,
    caseState,
  });
  // /Assignment

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
    // Authenticated user
    authenticatedUser,
    // /Authenticated user

    // Current entity
    initials,
    isLoadingEntity,
    // /Current entity

    // Case decisions
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
    // /Case decisions

    // Assignment
    assigneesWithoutMe,
    isAssignToMeDisabled,
    isAssignToOtherDisabled,
    isUnassignDisabled,
    onAssign,
    onAssignMe,
    onUnassign,
    debouncedIsLoadingAssignEntity,
    // /Assignment

    isLoading,
  };
};
