import { useCallback, useMemo } from 'react';
import { useNavigate, useSearch as useTanStackSearch } from '@tanstack/react-router';
import { AnyArray, TRouteId } from '../../types';
import { pagination } from 'hooks/usePagination/pagination';

/**
 * @description A hook to manage pagination state to be consumed by Mantine's Pagination component. Not using Mantine's usePagination hook since it doesn't support changing the number of items per page.
 * @param props
 * @param props.data - The data to paginate.
 * @param props.initialPage - Defaults to 1.
 * @param props.initialPageSize - The number of items per page.
 */
export const usePagination = <TArray extends AnyArray, TId extends TRouteId>({
  routeId,
  data,
  initialPage = 1,
  initialPageSize = 10,
  siblings = 2,
}: {
  routeId: TId;
  data: TArray;
  initialPage?: number;
  initialPageSize?: number;
  siblings?: number;
}) => {
  const navigate = useNavigate({ from: routeId });
  const { page = initialPage, pageSize = initialPageSize } = useTanStackSearch({
    from: routeId,
    strict: false,
    track: searchParams => ({
      page: 'page' in searchParams ? searchParams?.page : undefined,
      pageSize: 'pageSize' in searchParams ? searchParams?.pageSize : undefined,
    }),
  });
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
      void navigate({
        // @ts-ignore
        search: prevState => ({
          // @ts-ignore
          ...prevState,
          page,
          pageSize,
        }),
      });
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
