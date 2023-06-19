import { CaseState } from '../../../../../../common/enums';
import { TAuthenticatedUser } from '../../../../../../domains/auth/types';

export const useCaseState = (authenticatedUser: TAuthenticatedUser, workflow) => {
  const assigneeId = workflow?.assigneeId || workflow?.assignee?.id;

  if (!workflow) return CaseState.UNKNOWN;
  if (assigneeId === authenticatedUser?.id) return CaseState.ASSIGNED_TO_ME;
  if (!assigneeId) return CaseState.UNASSIGNED;

  return CaseState.ASSIGNED_TO_OTHER;
};
