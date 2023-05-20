import { TAuthenticatedUser } from '../../../../../../api/types';
import { CaseState } from '../../../../../../enums';

export const useCaseState = (authenticatedUser: TAuthenticatedUser, workflow) => {
  if (!workflow) return CaseState.UNKNOWN;
  if (workflow?.assigneeId === authenticatedUser?.id) return CaseState.ASSIGNED_TO_ME;
  if (!workflow?.assigneeId) return CaseState.UNASSIGNED;

  return CaseState.ASSIGNED_TO_OTHER;
};
