import { createQueryKeys } from '@lukemorales/query-key-factory';

import {
  fetchIdentityVerificationAssessments,
  fetchAssessment,
  fetchAssessments,
  IIdentityVerificationAssessmentsParams,
  IAssessmentsParams,
  IAssessmentType,
} from './fetchers';

export const assessmentsQueryKey = createQueryKeys('assessments', {
  list: (type: IAssessmentType, { page, ...params }: IAssessmentsParams) => ({
    queryKey: [{ type, page, ...params }],
    queryFn: () => {
      const data = {
        ...params,
        page: {
          size: Number(page.size),
          number: Number(page.number),
        },
      };

      return fetchAssessments(type, data);
    },
  }),
  findById: ({ id }: { id: string }) => ({
    queryKey: [{ id }],
    queryFn: () => fetchAssessment(id),
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
