import { useCallback } from 'react';
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
import { someDocumentDecisionStatus } from '../../../../../../common/utils/some-document-decision-status/some-document-decision-status';
import { everyDocumentDecisionStatus } from '../../../../../../common/utils/every-document-decision-status/every-document-decision-status';
import { safeEvery } from '../../../../../../common/utils/safe-every/safe-every';
import { useRevisionCaseMutation } from '../../../../../../domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';

export const useActions = ({ workflowId, fullName }: IUseActions) => {
  const onSelectNextEntity = useSelectNextEntity();
  const filterId = useFilterId();
  const { data: workflow, isLoading: isLoadingCase } = useWorkflowQuery({ workflowId, filterId });
  const { mutate: mutateApproveEntity, isLoading: isLoadingApproveEntity } =
    useApproveEntityMutation({
      workflowId: workflowId,
      onSelectNextEntity,
    });
  const { mutate: mutateRevisionCase, isLoading: isLoadingRevisionCase } = useRevisionCaseMutation({
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
  const hasDecision = safeEvery(
    workflow?.context?.documents,
    document => !!document?.decision?.status,
  );
  const canTakeAction = caseState.actionButtonsEnabled && hasDecision;
  // Disable the reject/approve buttons if the end user is not ready to be rejected/approved.
  // Based on `workflowDefinition` - ['APPROVE', 'REJECT', 'RECOLLECT'].
  const canReject =
    canTakeAction && someDocumentDecisionStatus(workflow?.context?.documents, 'rejected');
  const canRevision =
    canTakeAction &&
    !canReject &&
    someDocumentDecisionStatus(workflow?.context?.documents, 'revision');
  const canApprove =
    caseState.actionButtonsEnabled &&
    everyDocumentDecisionStatus(workflow?.context?.documents, 'approved');

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectEntity = useDebounce(isLoadingRejectEntity, 300);
  const debouncedIsLoadingRevisionCase = useDebounce(isLoadingRevisionCase, 300);
  const debouncedIsLoadingApproveEntity = useDebounce(isLoadingApproveEntity, 300);
  const debouncedIsLoadingAssignEntity = useDebounce(isLoadingAssignWorkflow, 300);

  // Avoid passing the onClick event to mutate
  const onMutateApproveEntity = useCallback(() => mutateApproveEntity(), [mutateApproveEntity]);
  const onMutateRevisionCase = useCallback(() => mutateRevisionCase(), [mutateRevisionCase]);
  const onMutateRejectEntity = useCallback(() => mutateRejectEntity(), [mutateRejectEntity]);
  const onMutateAssignWorkflow = useCallback(
    (assigneeId: string, isAssignedToMe: boolean) =>
      mutateAssignWorkflow({
        assigneeId,
        isAssignedToMe,
      }),
    [mutateAssignWorkflow],
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
    onMutateRevisionCase,
    onMutateRejectEntity,
    onMutateAssignWorkflow,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingRevisionCase,
    debouncedIsLoadingAssignEntity,
    isLoading,
    initials,
    canReject,
    canApprove,
    canRevision,
    caseState,
    authenticatedUser,
    assignees,
    hasDecision,
    isLoadingCase,
  };
};
