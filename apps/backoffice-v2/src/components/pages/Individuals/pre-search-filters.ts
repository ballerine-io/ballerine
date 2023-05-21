import { State } from '../../../enums';

const sharedPreSearchFilters = {
  sortDir: 'desc' as const,
  pageSize: 10,
  page: 1,
  search: '',
} as const;

export const preSearchFiltersByKind = {
  businesses: {
    sortBy: 'caseCreatedAt' as const,
    entity: 'businesses' as const,
    filter: {
      assigneeId: [],
    },
    ...sharedPreSearchFilters,
  },
  individuals: {
    sortBy: 'caseCreatedAt' as const,
    entity: 'individuals' as const,
    filter: {
      approvalState: [State.PROCESSING],
      assigneeId: [],
    },
    ...sharedPreSearchFilters,
  },
} as const;
