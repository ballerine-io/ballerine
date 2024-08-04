import { useCallback } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { defaultSerializer } from '@/common/hooks/useZodSearchParams/utils/default-serializer';

export const usePagination = () => {
  const [searchParams] = useSerializedSearchParams();

  const onPaginate = useCallback(
    (page: number) => {
      return defaultSerializer({
        ...searchParams,
        page: page.toString(),
      });
    },
    [searchParams],
  );

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
    onPaginate,
    onNextPage,
    onPrevPage,
  };
};
