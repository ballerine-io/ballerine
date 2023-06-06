import { useCallback, useMemo } from 'react';
import { AnyArray, TKeyofArrayElement } from '../../types';
import { filter as onFilter } from './filter';
import { useSearchParamsByEntity } from '../useSearchParamsByEntity/useSearchParamsByEntity';

/**
 * @description A hook to easily filter an array of objects by key using fuzzy search.
 * @param props
 * @param props.data - The data to filter.
 * @param props.filter - The initial filter - defaults to empty string.
 */
export const useFilter = <TArray extends AnyArray>({
  data,
  initialFilter,
}: {
  data: TArray;
  initialFilter?: Record<TKeyofArrayElement<TArray>, Array<string>>;
}) => {
  const [{ filter = initialFilter }, setSearchParams] = useSearchParamsByEntity();
  const filtered = useMemo(
    () =>
      onFilter({
        data,
        filter,
      }),
    [data, filter],
  );
  const onFilterChange = useCallback(
    (value: {
      [key in TKeyofArrayElement<TArray>]?: Array<string>;
    }) => {
      setSearchParams({
        filter: {
          ...filter,
          ...value,
        },
      });
    },
    [filter, setSearchParams],
  );

  return {
    filtered,
    filter,
    onFilter: onFilterChange,
  };
};
