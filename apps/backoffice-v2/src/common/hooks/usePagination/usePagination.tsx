import { createSearchParams, useSearchParams } from 'react-router-dom';
import { searchParamsToObject } from '@/common/hooks/useZodSearchParams/utils/search-params-to-object';
import { useCallback } from 'react';

export const usePagination = () => {
  const [searchParams] = useSearchParams();
  const searchParamsAsObject = searchParamsToObject(searchParams);

  const onPaginate = useCallback(
    (page: number) => {
      return createSearchParams({
        ...searchParamsAsObject,
        page: page.toString(),
      }).toString();
    },
    [searchParamsAsObject],
  );
  const onNextPage = useCallback(() => {
    const pageNumber = Number(searchParamsAsObject.page);
    const nextPage = pageNumber + 1;

    return createSearchParams({
      ...searchParamsAsObject,
      page: nextPage.toString(),
    }).toString();
  }, [searchParamsAsObject]);
  const onPrevPage = useCallback(() => {
    const pageNumber = Number(searchParamsAsObject.page);
    const nextPage = pageNumber - 1;

    return createSearchParams({
      ...searchParamsAsObject,
      page: nextPage.toString(),
    }).toString();
  }, [searchParamsAsObject]);

  return {
    page: searchParamsAsObject.page,
    pageSize: searchParamsAsObject.pageSize,
    onPaginate,
    onNextPage,
    onPrevPage,
  };
};
