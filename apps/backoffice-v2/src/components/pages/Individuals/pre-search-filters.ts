import { State } from '../../../enums';

const sharedPreSearchFilters = {
  sortDir: 'desc' as const,
  pageSize: 10,
  page: 1,
  search: '',
} as const;

export const preSearchFiltersByKind = {
  businesses: {
    sortBy: 'createdAt' as const,
    entity: 'businesses' as const,
    filter: {
      approvalState: [State.PROCESSING],
      assigneeId: [],
    },
    ...sharedPreSearchFilters,
  },
  individuals: {
    sortBy: 'createdAt' as const,
    entity: 'individuals' as const,
    filter: {
      approvalState: [State.PROCESSING],
      endUserType: [],
      assigneeId: [],
    },
    ...sharedPreSearchFilters,
  },
} as const;
