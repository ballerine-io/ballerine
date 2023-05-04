import { State } from '../../../enums';

const sharedPreSearchFilters = {
  sortDir: 'desc' as const,
  pageSize: 10,
  page: 1,
  search: '',
} as const;
export const preSearchFiltersByKind = {
  businesses: {
    sortBy: 'website' as const,
    kind: 'businesses' as const,
    filter: {
      approvalState: [State.PROCESSING],
    },
    ...sharedPreSearchFilters,
  },
  individuals: {
    sortBy: 'createdAt' as const,
    kind: 'individuals' as const,
    filter: {
      approvalState: [State.PROCESSING],
      endUserType: [],
    },
    ...sharedPreSearchFilters,
  },
} as const;
