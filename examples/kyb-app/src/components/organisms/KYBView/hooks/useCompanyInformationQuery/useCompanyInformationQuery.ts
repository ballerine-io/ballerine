import { companiesQueryKeys } from '@app/domains/companies';
import { useQuery } from '@tanstack/react-query';

export const useCompanyInformationQuery = (
  registrationNumber = '',
  jurisdictionCode = '',
  enabled?: boolean,
) => {
  const { data, isFetching } = useQuery({
    ...companiesQueryKeys.fetchCompanyInformation({ registrationNumber, jurisdictionCode }),
    enabled,
    retry: false,
  });

  return {
    data,
    isFetching,
  };
};
