import { useCallback, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { AnyArray, TKeyofArrayElement, TRouteId } from '@/types';
import { filter as onFilter } from './filter';

/**
 * @description A hook to easily filter an array of objects by key using fuzzy search.
 * @param props
 * @param props.data - The data to filter.
 * @param props.filter - The initial filter - defaults to empty string.
 */
export const useFilter = <TArray extends AnyArray, TId extends TRouteId>({
  routeId,
  data,
  initialFilter,
}: {
  routeId: TId;
  data: TArray;
  initialFilter?: Record<TKeyofArrayElement<TArray>, Array<string>>;
}) => {
  const { filter = initialFilter } = useSearch();
  const filtered = useMemo(
    () =>
      onFilter({
        data,
        filter,
      }),
    [data, filter],
  );
  const navigate = useNavigate({ from: routeId });
  const onFilterChange = useCallback(
    (value: {
      [key in TKeyofArrayElement<TArray>]?: Array<string>;
    }) => {
      // @ts-ignore
      navigate({
        // @ts-ignore
        search: prevState => ({
          // @ts-ignore
          ...prevState,
          filter: {
            // @ts-ignore
            ...prevState?.filter,
            ...value,
          },
        }),
      });
    },
    [navigate],
  );

  return {
    filtered,
    filter,
    onFilter: onFilterChange,
  };
};
