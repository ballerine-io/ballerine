import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchKybAndUbosChecks, IKybAndUbosChecksParams } from './fetchers';

export const kybAndUbosChecksQueryKey = createQueryKeys('kyb-and-ubos-checks', {
  list: ({ page, ...params }: IKybAndUbosChecksParams) => ({
    queryKey: [{ page, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        number: isNaN(Number(page)) ? 1 : Number(page),
        size: isNaN(Number(page.size)) ? 10 : Number(page.size),
      };

      return fetchKybAndUbosChecks(data);
    },
  }),
});
