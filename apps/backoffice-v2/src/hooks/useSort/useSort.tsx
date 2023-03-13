import { useCallback, useMemo } from 'react';
import { AnyArray, TKeyofArrayElement, TRouteId } from '../../types';
import { sort } from 'hooks/useSort/sort';
import { useNavigate, useSearch as useTanStackSearch } from '@tanstack/react-router';

/**
 * @description A hook to easily sort an array of objects by key, and change sort direction or the sort by key.
 * @param props
 * @param props.data - The data to sort.
 * @param props.initialState - An object of the initial sorting direction and sort by state.
 */
export const useSort = <TArray extends AnyArray, TId extends TRouteId>({
  routeId,
  data,
  initialState,
}: {
  routeId: TId;
  data: TArray;
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: TKeyofArrayElement<TArray>;
  };
}) => {
  const { sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' } =
    useTanStackSearch({
      from: routeId,
      strict: false,
      track: searchParams => ({
        sortBy: 'sortBy' in searchParams ? searchParams?.sortBy : undefined,
        sortDir: 'sortDir' in searchParams ? searchParams?.sortDir : undefined,
      }),
    });
  const navigate = useNavigate({ from: routeId });
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
    // @ts-ignore
    navigate({
      // @ts-ignore
      search: prevState => ({
        // @ts-ignore
        ...prevState,
        sortDir: sortDir === 'asc' ? 'desc' : 'asc',
      }),
    });
  }, [navigate, sortDir]);
  const onSortBy = useCallback(
    (sortBy: string) => {
      // @ts-ignore
      navigate({
        // @ts-ignore
        search: prevState => ({
          // @ts-ignore
          ...prevState,
          sortBy,
        }),
      });
    },
    [navigate],
  );

  return {
    sortBy,
    sortDir,
    sorted,
    onSortDir,
    onSortBy,
  };
};
