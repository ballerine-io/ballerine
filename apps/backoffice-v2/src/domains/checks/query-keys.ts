import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchIdentityVerificationChecks,
  fetchKybAndUbosChecks,
  IIdentityVerificationChecksParams,
  IKybAndUbosChecksParams,
} from './fetchers';

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
