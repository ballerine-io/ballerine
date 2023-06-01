import { CaseState } from '../../../../../../common/enums';
import { TAuthenticatedUser } from '../../../../../../domains/auth/types';

export const useCaseState = (authenticatedUser: TAuthenticatedUser, workflow) => {
  if (!workflow) return CaseState.UNKNOWN;
  if (workflow?.assigneeId === authenticatedUser?.id) return CaseState.ASSIGNED_TO_ME;
  if (!workflow?.assigneeId) return CaseState.UNASSIGNED;

  return CaseState.ASSIGNED_TO_OTHER;
};
