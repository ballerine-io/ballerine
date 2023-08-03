import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../../../common/utils/is-string/is-string';
import { fetchNominatimSearch } from './fetcher';

export const useNominatimQuery = ({
  country,
  city,
  street,
}: {
  country: string;
  city: string;
  street: string;
}) => {
  return useQuery({
    queryKey: ['nominatim', 'search', { country, city, street }],
    queryFn: () =>
      fetchNominatimSearch({
        country,
        city,
        street,
      }),
    staleTime: Infinity,
    refetchInterval: false,
    enabled:
      isString(country) &&
      !!country?.length &&
      isString(city) &&
      !!city?.length &&
      isString(street) &&
      !!street?.length,
  });
};
