import { createQueryKeys } from '@lukemorales/query-key-factory';
import { api } from '../../api/api';

export const companies = createQueryKeys('companies', {
  list: (filterId: string) => ({
    queryKey: [{ filterId }],
    queryFn: () => api.companies.list(filterId),
  }),
  byId: (companyId: string) => ({
    queryKey: [companyId],
    queryFn: () => api.companies.byId(companyId),
  }),
});
