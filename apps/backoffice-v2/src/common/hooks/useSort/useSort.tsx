import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchParamsToObject } from '@/common/hooks/useZodSearchParams/utils/search-params-to-object';

export const useSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sortDir, sortBy } = searchParamsToObject(searchParams);
  const onSortDirToggle = useCallback(
    (next?: 'asc' | 'desc') => {
      searchParams.set('sortDir', next ? next : sortDir === 'asc' ? 'desc' : 'asc');

      setSearchParams(searchParams);
    },
    [searchParams, sortDir, setSearchParams],
  );

  const onSortBy = useCallback(
    (sortBy: string) => {
      searchParams.set('sortBy', sortBy);

      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  return {
    onSortDirToggle,
    onSortBy,
    sortDir,
    sortBy,
  };
};
