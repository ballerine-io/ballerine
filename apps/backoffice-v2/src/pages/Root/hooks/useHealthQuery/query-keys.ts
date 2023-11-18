import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchHealth } from './fetchers';

export const healthQueryKeys = createQueryKeys('_health', {
  live: () => ({
    queryKey: [{}],
    queryFn: () => fetchHealth(),
  }),
});
