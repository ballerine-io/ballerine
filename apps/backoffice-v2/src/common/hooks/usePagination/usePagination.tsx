import { useCallback, useEffect } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { defaultSerializer } from '@/common/hooks/useZodSearchParams/utils/default-serializer';

export const usePagination = ({ totalPages }: { totalPages: number }) => {
  const [searchParams, setSearchParams] = useSerializedSearchParams();
  const page = Number(searchParams.page);

  useEffect(() => {
    let redirectToPage;
    if (page <= 0) {
      redirectToPage = 1;
    }
    if (totalPages && page > totalPages) {
      redirectToPage = totalPages;
    }

    if (!redirectToPage) return;

    setSearchParams({
      page: redirectToPage,
    });
  }, [page, totalPages]);

  const isLastPage = page === totalPages || totalPages === 0;

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
    const nextPage = Math.min(page + 1, totalPages);

    return defaultSerializer({
      ...searchParams,
      page: nextPage.toString(),
    });
  }, [searchParams, totalPages]);

  const onPrevPage = useCallback(() => {
    const nextPage = Math.max(page - 1, 1);

    return defaultSerializer({
      ...searchParams,
      page: nextPage.toString(),
    });
  }, [searchParams]);

  return {
    page,
    pageSize: searchParams.pageSize,
    isLastPage,
    onPaginate,
    onLastPage,
    onNextPage,
    onPrevPage,
  };
};
