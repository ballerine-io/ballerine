import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useCallback, useMemo } from 'react';
import { useDebounce } from '../../../../../../common/hooks/useDebounce/useDebounce';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { createInitials } from '../../../../../../common/utils/create-initials/create-initials';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useUsersQuery } from '../../../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useAssignWorkflowMutation } from '../../../../../../domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { tagToBadgeData } from '../../consts';
import { useCaseDecision } from '../useCaseDecision/useCaseDecision';
import { useCaseState } from '../useCaseState/useCaseState';
import { IUseActions } from './interfaces';

export const useCaseActionsLogic = ({ workflowId, fullName }: IUseActions) => {
  const filterId = useFilterId();
  const { data: workflow, isLoading: isLoadingCase } = useWorkflowByIdQuery({
    workflowId,
    filterId,
  });

  const { mutate: mutateAssignWorkflow, isLoading: isLoadingAssignWorkflow } =
    useAssignWorkflowMutation({ workflowRuntimeId: workflowId });

  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);

  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user;
  const caseState = useCaseState(authenticatedUser, workflow);
  const { data: assignees } = useUsersQuery();
  const { hasDecision, canApprove, canReject, canRevision } = useCaseDecision();

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingAssignEntity = useDebounce(isLoadingAssignWorkflow, 300);

  // Avoid passing the onClick event to mutate
  const onMutateAssignWorkflow = useCallback(
    (assigneeId: string, isAssignedToMe: boolean) =>
      mutateAssignWorkflow({
        assigneeId,
        isAssignedToMe,
      }),
    [mutateAssignWorkflow],
  );

  const tag = useMemo(() => {
    return workflow?.tags?.find(t => tagToBadgeData[t]);
  }, [workflow]) as keyof typeof tagToBadgeData;

  const isActionButtonDisabled = !caseState.actionButtonsEnabled;

  const assignedUser = workflow?.assignee
    ? {
        id: workflow?.assignee?.id,
        fullName: `${workflow?.assignee?.firstName} ${workflow?.assignee?.lastName}`,
        avatarUrl: workflow?.assignee?.avatarUrl,
      }
    : undefined;

  const isWorkflowCompleted = workflow?.status === 'completed';

  return {
    isActionButtonDisabled,
    onMutateAssignWorkflow,
    debouncedIsLoadingAssignEntity,
    initials,
    canReject,
    canApprove,
    canRevision,
    caseState,
    authenticatedUser,
    assignees,
    assignedUser,
    hasDecision,
    isLoadingCase,
    tag,
    workflow,
    workflowDefinition: workflow?.workflowDefinition,
    isWorkflowCompleted,
  };
};
