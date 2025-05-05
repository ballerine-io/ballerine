import { createQueryKeys } from '@lukemorales/query-key-factory';

import { fetchIdentityVerificationChecks, IIdentityVerificationChecksParams } from './fetchers';

export const identityVerificationChecksQueryKey = createQueryKeys('identity-verification-checks', {
  list: ({ page, ...params }: IIdentityVerificationChecksParams) => ({
    queryKey: [{ page, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        page: {
          number: Number(page),
          size: Number(page.size),
        },
      };

      return fetchIdentityVerificationChecks(data);
    },
  }),
});
