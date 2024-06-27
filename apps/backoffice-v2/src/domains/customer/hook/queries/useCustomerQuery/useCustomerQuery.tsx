import { customerQueryKeys } from '../../../query-keys';
import { useQuery } from '@tanstack/react-query';

export const useCustomerQuery = () => {
  return useQuery({
    ...customerQueryKeys.getCurrent(),
    staleTime: 1_000_000,
    refetchInterval: 1_000_000,
  });
};
