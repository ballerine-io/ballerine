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
      approvalState: [State.PROCESSING],
      companyType: [],
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
