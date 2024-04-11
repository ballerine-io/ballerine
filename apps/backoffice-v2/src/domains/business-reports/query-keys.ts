import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchBusinessReports } from '@/domains/business-reports/queries';

export const businessReportsQueryKey = createQueryKeys('business-reports', {
  list: ({ businessId }: { businessId: string }) => ({
    queryKey: [{ businessId }],
    queryFn: () => fetchBusinessReports({ businessId }),
  }),
});
