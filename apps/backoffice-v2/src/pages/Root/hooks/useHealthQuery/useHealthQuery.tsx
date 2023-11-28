import { useQuery } from '@tanstack/react-query';
import { healthQueryKeys } from './query-keys';

export const useHealthQuery = () => {
  return useQuery({
    ...healthQueryKeys.live(),
    staleTime: 100_000,
  });
};
