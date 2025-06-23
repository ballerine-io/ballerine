import { useQuery } from '@tanstack/react-query';
import { snakeCase } from 'lodash-es';

import { assessmentEnumSchema, IAssessmentsParams } from '@/domains/assessments/fetchers';
import { assessmentsQueryKey } from '@/domains/assessments/query-keys';
import { useIsAuthenticated } from '@/domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useAssessmentsQuery = (type: string, params: IAssessmentsParams) => {
  const isAuthenticated = useIsAuthenticated();

  const assessmentTypeValidationResult = assessmentEnumSchema.safeParse(snakeCase(type));

  if (!assessmentTypeValidationResult.success) {
    throw new Error(`Invalid assessment type: ${type}`);
  }

  return useQuery({
    ...assessmentsQueryKey.list(assessmentTypeValidationResult.data, params),
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });
};
