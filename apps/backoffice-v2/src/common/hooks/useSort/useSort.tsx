import { useCallback } from 'react';
import { useSearchParamsByEntity } from '../useSearchParamsByEntity/useSearchParamsByEntity';

/**
 * @description A hook to easily sort an array of objects by key, and change sort direction or the sort by key.
 * @param props
 * @param props.initialState - An object of the initial sorting direction and sort by state.
 */
export const useSort = ({
  initialState,
}: {
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: string;
  };
}) => {
  const [
    { sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' },
    setSearchParams,
  ] = useSearchParamsByEntity();
  // Sort
  const onSortDir = useCallback(() => {
    setSearchParams({
      sortDir: sortDir === 'asc' ? 'desc' : 'asc',
    });
  }, [setSearchParams, sortDir]);
  const onSortBy = useCallback(
    (sortBy: string) => {
      setSearchParams({
        sortBy,
      });
    },
    [setSearchParams],
  );

  return {
    sortBy,
    sortDir,
    onSortDir,
    onSortBy,
  };
};
