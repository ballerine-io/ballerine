import {
  getSortingDataFromQuery,
  SortingData,
} from '@app/common/hooks/useSorting/helpers/get-sorting-data-from-query';
import { buildSortingRegex } from '@app/common/hooks/useSorting/utils/build-sorting-regex';
import { SortingParams } from '@app/common/types/sorting-params.types';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSorting(prefix = 'order_by') {
  const regex = useMemo(() => buildSortingRegex(prefix), [prefix]);
  const [searchParams, setSearchParams] = useSearchParams();

  const parseResult: SortingData | null = useMemo(() => {
    return getSortingDataFromQuery(searchParams.toString(), regex);
  }, [searchParams, regex]);

  const setSorting = useCallback(
    (key: string, value: 'asc' | 'desc') => {
      if (parseResult) {
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
