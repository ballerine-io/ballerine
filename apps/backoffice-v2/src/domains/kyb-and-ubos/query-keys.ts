import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchKybAndUbosChecks, IKybAndUbosChecksParams } from './fetchers';

export const kybAndUbosChecksQueryKey = createQueryKeys('kyb-and-ubos-checks', {
  list: ({ page, ...params }: IKybAndUbosChecksParams) => ({
    queryKey: [{ page, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        page: {
          number: Number(page),
          size: Number(page.size),
        },
      };

      return fetchKybAndUbosChecks(data);
    },
  }),
});
