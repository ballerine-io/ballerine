import { useCallback, useMemo } from 'react';
import { AnyArray, TKeyofArrayElement } from '../../types';
import { sort } from './sort';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';

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
  const [{ sortBy = initialState?.sortBy, sortDir = initialState?.sortDir ?? 'asc' }] =
    useZodSearchParams(
      z.object({
        sortBy: z.string().catch(''),
        sortDir: z.string().catch(''),
      }),
    );
  const navigate = useNavigate();
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
    // navigate({
    // @ts-ignore
    // search: prevState => ({
    // @ts-ignore
    // ...prevState,
    // sortDir: sortDir === 'asc' ? 'desc' : 'asc',
    // }),
    // });
  }, [navigate, sortDir]);
  const onSortBy = useCallback(
    (sortBy: string) => {
      // @ts-ignore
      // navigate({
      // @ts-ignore
      // search: prevState => ({
      // @ts-ignore
      // ...prevState,
      // sortBy,
      // }),
      // });
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
