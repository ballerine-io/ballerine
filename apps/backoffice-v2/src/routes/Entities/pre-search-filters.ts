import { CaseStatus, State } from '../../common/enums';
import { TAuthenticatedUser } from '../../domains/auth/types';

const sharedPreSearchFilters = {
  sortDir: 'desc' as const,
  pageSize: 10,
  page: 1,
  search: '',
} as const;

export const generatePreSearchFiltersByEntity = async (
  entityType: string,
  authenticatedUser: TAuthenticatedUser,
) => {
  return {
    businesses: {
      sortBy: 'caseCreatedAt' as const,
      entity: 'businesses' as const,
      filter: {
        assigneeId: [null, authenticatedUser!.id],
        caseStatus: [CaseStatus.ACTIVE],
      },
      ...sharedPreSearchFilters,
    },
    individuals: {
      sortBy: 'caseCreatedAt' as const,
      entity: 'individuals' as const,
      filter: {
        approvalState: [State.PROCESSING],
        assigneeId: [null, authenticatedUser.id],
        caseStatus: [CaseStatus.ACTIVE],
      },
      ...sharedPreSearchFilters,
    },
  };
};
