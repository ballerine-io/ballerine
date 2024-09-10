import { useCallback } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { defaultSerializer } from '@/common/hooks/useZodSearchParams/utils/default-serializer';

export const usePagination = ({ totalPages }: { totalPages: number }) => {
  const [searchParams] = useSerializedSearchParams();

  const isLastPage = Number(searchParams.page) === totalPages || totalPages === 0;

  const onPaginate = useCallback(
    (page: number) => {
      return defaultSerializer({
        ...searchParams,
        page: page.toString(),
      });
    },
    [searchParams],
  );

  const onLastPage = useCallback(() => {
    return defaultSerializer({
      ...searchParams,
      page: totalPages.toString(),
    });
  }, [searchParams, totalPages]);

  const onNextPage = useCallback(() => {
    const pageNumber = Number(searchParams.page);
    const nextPage = pageNumber + 1;

    return defaultSerializer({
      ...searchParams,
      page: nextPage.toString(),
    });
  }, [searchParams]);

  const onPrevPage = useCallback(() => {
    const pageNumber = Number(searchParams.page);
    const nextPage = pageNumber - 1;

    return defaultSerializer({
      ...searchParams,
      page: nextPage.toString(),
    });
  }, [searchParams]);

  return {
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    isLastPage,
    onPaginate,
    onLastPage,
    onNextPage,
    onPrevPage,
  };
};
