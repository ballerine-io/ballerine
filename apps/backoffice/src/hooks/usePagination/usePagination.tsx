import { useCallback, useState } from 'react';

/**
 * @description A hook to manage pagination state to be consumed by Mantine's Pagination component. Not using Mantine's usePagination hook since it doesn't support changing the number of items per page.
 * @param props
 * @param props.data - The data to paginate.
 * @param props.initialPage - Defaults to 1.
 * @param props.pageSize - The number of items per page.
 */
export const usePagination = <TRecord extends Record<PropertyKey, any>>({
  data,
  initialPage = 1,
  pageSize,
}: {
  data: Array<TRecord>;
  initialPage?: number;
  pageSize: number;
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const total = data?.length || 0;
  const pagesCount = Math.ceil(total / pageSize);
  const paginated = data?.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const onPaginate = useCallback((page: number) => setCurrentPage(page), [setCurrentPage]);

  return {
    paginated,
    currentPage,
    onPaginate,
    pagesCount,
    total,
  };
};
