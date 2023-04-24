import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const companies = createQueryKeys('companies', {
  list: () => ({
    queryKey: [{}],
    queryFn: () => api.companies.list(),
  }),
  byId: (companyId: string) => ({
    queryKey: [companyId],
    queryFn: () => api.companies.byId(companyId),
  }),
});
