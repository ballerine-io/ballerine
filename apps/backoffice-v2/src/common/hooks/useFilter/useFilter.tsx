import { useCallback, useMemo } from 'react';
import { AnyArray, TKeyofArrayElement } from '../../types';
import { filter as onFilter } from './filter';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';

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
  const [{ filter = initialFilter }] = useZodSearchParams(
    z.object({
      filter: z.string().catch(''),
    }),
  );
  const filtered = useMemo(
    () =>
      onFilter({
        data,
        filter,
      }),
    [data, filter],
  );
  const navigate = useNavigate();
  const onFilterChange = useCallback(
    (value: {
      [key in TKeyofArrayElement<TArray>]?: Array<string>;
    }) => {
      // @ts-ignore
      // navigate({
      // @ts-ignore
      // search: prevState => ({
      // @ts-ignore
      // ...prevState,
      // filter: {
      // @ts-ignore
      // ...prevState?.filter,
      // ...value,
      // },
      // }),
      // });
    },
    [navigate],
  );

  return {
    filtered,
    filter,
    onFilter: onFilterChange,
  };
};
