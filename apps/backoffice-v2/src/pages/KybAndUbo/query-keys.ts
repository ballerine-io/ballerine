import { createQueryKeys } from '@lukemorales/query-key-factory';
import { fetchFindings } from '@/pages/MerchantMonitoring/fetchers';

export const findingsQueryKey = createQueryKeys('findings', {
  list: () => ({
    queryKey: [{}],
    queryFn: fetchFindings,
  }),
});
