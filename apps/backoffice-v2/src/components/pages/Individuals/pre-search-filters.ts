import { State } from '../../../enums';

const sharedPreSearchFilters = {
  sortDir: 'desc' as const,
  pageSize: 10,
  page: 1,
  search: '',
} as const;
export const preSearchFiltersByKind = {
  companies: {
    sortBy: 'website' as const,
    kind: 'companies' as const,
    filter: {
      state: [State.PROCESSING],
      companyType: [],
    },
    ...sharedPreSearchFilters,
  },
  individuals: {
    sortBy: 'createdAt' as const,
    kind: 'individuals' as const,
    filter: {
      state: [State.PROCESSING],
      endUserType: [],
    },
    ...sharedPreSearchFilters,
  },
} as const;
