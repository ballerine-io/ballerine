import { getSortingDataFromQuery } from '@/common/hooks/useSorting/helpers/get-sorting-data-from-query';
import { buildSortingRegex } from '@/common/hooks/useSorting/utils/build-sorting-regex';
import { SortingParams } from '@/common/types/sorting-params.types';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSorting(prefix = 'order_by') {
  const [searchParams, setSearchParams] = useSearchParams();

  const parseResult = useMemo(() => {
    return getSortingDataFromQuery(searchParams.toString(), buildSortingRegex(prefix));
  }, [prefix, searchParams]);

  const setSorting = useCallback(
    (key: string, value: 'asc' | 'desc') => {
      if (parseResult?.keyWithPrefix) {
        searchParams.delete(parseResult.keyWithPrefix);
      }

      searchParams.set(`${prefix}_${key}`, value);

      setSearchParams(searchParams);
    },
    [prefix, searchParams, parseResult, setSearchParams],
  );

  return {
    sortingKey: parseResult?.key as SortingParams['orderBy'],
    sortingDirection: parseResult?.value as SortingParams['orderDirection'],
    setSorting,
  };
}
