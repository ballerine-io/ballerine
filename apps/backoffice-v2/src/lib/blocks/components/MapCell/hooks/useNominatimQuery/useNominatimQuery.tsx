import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../../../common/utils/is-string/is-string';
import { fetchNominatimSearch } from './fetcher';

export const useNominatimQuery = (
  address:
    | {
        country: string;
        city: string;
        street: string;
      }
    | string
    | undefined,
) => {
  const enabled =
    typeof address === 'string'
      ? !!address?.length
      : isString(address?.country) &&
        !!address?.country?.length &&
        isString(address?.city) &&
        !!address?.city?.length &&
        isString(address?.street) &&
        !!address?.street?.length;

  return useQuery({
    queryKey: ['nominatim', 'search', { address }],
    queryFn: () => fetchNominatimSearch(address),
    staleTime: Infinity,
    refetchInterval: false,
    enabled,
  });
};
