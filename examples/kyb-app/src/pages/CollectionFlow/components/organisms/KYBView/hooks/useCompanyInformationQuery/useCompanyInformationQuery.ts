import { businessQueryKeys } from '@app/domains/business/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useCompanyInformationQuery = (
  registrationNumber = '',
  jurisdictionCode = '',
  enabled?: boolean,
) => {
  const { data, isFetching } = useQuery({
    ...businessQueryKeys.getBusinessInformation({ registrationNumber, jurisdictionCode }),
    enabled,
    retry: false,
  });

  return {
    data,
    isFetching,
  };
};
