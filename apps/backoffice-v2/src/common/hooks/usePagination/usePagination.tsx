import { createSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';

export const usePagination = () => {
  const [searchParams] = useSerializedSearchParams();

  const onPaginate = useCallback(
    (page: number) => {
      return createSearchParams({
        ...searchParams,
        page: page.toString(),
      }).toString();
    },
    [searchParams],
  );
  const onNextPage = useCallback(() => {
    const pageNumber = Number(searchParams.page);
    const nextPage = pageNumber + 1;

    return createSearchParams({
      ...searchParams,
      page: nextPage.toString(),
    }).toString();
  }, [searchParams]);
  const onPrevPage = useCallback(() => {
    const pageNumber = Number(searchParams.page);
    const nextPage = pageNumber - 1;

    return createSearchParams({
      ...searchParams,
      page: nextPage.toString(),
    }).toString();
  }, [searchParams]);

  return {
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    onPaginate,
    onNextPage,
    onPrevPage,
  };
};
