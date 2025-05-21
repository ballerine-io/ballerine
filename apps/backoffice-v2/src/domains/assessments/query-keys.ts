import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchIdentityVerificationAssessments,
  fetchKybAndOwnershipAssessment,
  fetchKybAndOwnershipAssessments,
  IIdentityVerificationAssessmentsParams,
  IKybAndOwnershipAssessmentsParams,
} from './fetchers';

export const kybAndOwnershipAssessmentsQueryKey = createQueryKeys('kyb-and-ownership-assessments', {
  list: ({ page, ...params }: IKybAndOwnershipAssessmentsParams) => ({
    queryKey: [{ page, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        size: Number(page.size),
        number: Number(page.number),
      };

      return fetchKybAndOwnershipAssessments(data);
    },
  }),
  findById: ({ id }: { id: string }) => ({
    queryKey: [{ id }],
    queryFn: () => fetchKybAndOwnershipAssessment(id),
  }),
});

export const identityVerificationAssessmentsQueryKey = createQueryKeys(
  'identity-verification-assessments',
  {
    list: ({ page, ...params }: IIdentityVerificationAssessmentsParams) => ({
      queryKey: [{ page, ...params }],
      queryFn: () => {
        const data = {
          ...params,
          page: {
            size: Number(page.size),
            number: Number(page.number),
          },
        };

        return fetchIdentityVerificationAssessments(data);
      },
    }),
  },
);
