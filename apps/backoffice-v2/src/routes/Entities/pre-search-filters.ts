import { CaseStatus, State } from '../../common/enums';

const sharedPreSearchFilters = {
  sortDir: 'desc' as const,
  limit: 10,
  page: 1,
  search: '',
} as const;

export const preSearchFiltersByKind = {
  businesses: {
    sortBy: 'createdAt' as const,
    entity: 'businesses' as const,
    filter: {
      assigneeId: [],
      caseStatus: [CaseStatus.ACTIVE],
    },
    ...sharedPreSearchFilters,
  },
  individuals: {
    sortBy: 'createdAt' as const,
    entity: 'individuals' as const,
    filter: {
      approvalState: [],
      assigneeId: [],
      caseStatus: [CaseStatus.ACTIVE],
    },
    ...sharedPreSearchFilters,
  },
} as const;
