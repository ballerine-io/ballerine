import { useCallback, useMemo } from 'react';
import { AnyArray } from '../../types';
import { pagination } from './pagination';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';

/**
 * @description A hook to manage pagination state to be consumed by Mantine's Pagination component. Not using Mantine's usePagination hook since it doesn't support changing the number of items per page.
 * @param props
 * @param props.data - The data to paginate.
 * @param props.initialPage - Defaults to 1.
 * @param props.initialPageSize - The number of items per page.
 */
export const usePagination = <TArray extends AnyArray>({
  data,
  initialPage = 1,
  initialPageSize = 10,
  siblings = 2,
}: {
  data: TArray;
  initialPage?: number;
  initialPageSize?: number;
  siblings?: number;
}) => {
  const navigate = useNavigate();
  const [{ page = initialPage, pageSize = initialPageSize }] = useZodSearchParams(
    z.object({
      page: z.coerce.number().int().positive(),
      pageSize: z.coerce.number().int().positive(),
    }),
  );
  const { totalItems, totalPages, pages, paginated } = useMemo(
    () =>
      pagination({
        data,
        pageSize,
        page,
        siblings,
      }),
    [data, pageSize, page, siblings],
  );
  const onPaginate = useCallback(
    (page: number) => () => {
      // @ts-ignore
      // void navigate({
      // @ts-ignore
      // search: prevState => ({
      // @ts-ignore
      // ...prevState,
      // page,
      // pageSize,
      // }),
      // });
    },
    [navigate, pageSize],
  );

  return {
    paginated,
    onPaginate,
    totalItems,
    totalPages,
    pages,
    page,
    pageSize,
  };
};
