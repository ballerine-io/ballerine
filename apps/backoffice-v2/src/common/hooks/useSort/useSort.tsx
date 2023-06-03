import { useCallback, useMemo } from 'react';
import { AnyArray, TKeyofArrayElement } from '../../types';
import { sort } from './sort';
import { useSearchParamsByEntity } from '../useSearchParamsByEntity/useSearchParamsByEntity';

/**
 * @description A hook to easily sort an array of objects by key, and change sort direction or the sort by key.
 * @param props
 * @param props.data - The data to sort.
 * @param props.initialState - An object of the initial sorting direction and sort by state.
 */
export const useSort = <TArray extends AnyArray>({
  data,
  initialState,
}: {
  data: TArray;
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: TKeyofArrayElement<TArray>;
  };
}) => {
  const [
    { sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' },
    setSearchParams,
  ] = useSearchParamsByEntity();
  // Sort
  const sorted = useMemo(
    () =>
      sort({
        data,
        sortBy,
        sortDir,
      }),
    [data, sortDir, sortBy],
  );
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
    sorted,
    onSortDir,
    onSortBy,
  };
};
