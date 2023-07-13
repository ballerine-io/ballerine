import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useUsersQuery } from '../../../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useAssignWorkflowMutation } from '../../../../../../domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useDebounce } from '../../../../../../common/hooks/useDebounce/useDebounce';
import { CaseState } from '../../../../../../common/enums';
import { useCallback } from 'react';

export const useAssignment = ({
  workflowId,
  workflow,
  caseState,
}: {
  workflowId: string;
  workflow: ReturnType<typeof useWorkflowQuery>['data'];
  caseState: ReturnType<typeof useCaseState>;
}) => {
  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
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

  return {
    assigneesWithoutMe,
    isAssignToMeDisabled,
    isAssignToOtherDisabled,
    isUnassignDisabled,
    onAssign,
    onAssignMe,
    onUnassign,
    debouncedIsLoadingAssignEntity,
    isLoadingAssignWorkflow,
  };
};
