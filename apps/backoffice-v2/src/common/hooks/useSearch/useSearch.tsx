import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../useDebounce/useDebounce';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { searchParamsToObject } from '@/common/hooks/useZodSearchParams/utils/search-params-to-object';

export const useSearch = (
  {
    initialSearch = '',
  }: {
    initialSearch?: string;
  } = {
    initialSearch: '',
  },
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search = initialSearch, ...searchParamsAsObject } = searchParamsToObject(searchParams);
  const [_search, setSearch] = useState(search);
  const debouncedSearch = useDebounce(_search, 240);
  const onSearchChange = useCallback((search: string) => {
    setSearch(search);
  }, []);

  useEffect(() => {
    setSearchParams(
      createSearchParams({
        ...searchParamsAsObject,
        search: debouncedSearch,
        page: '1',
      }),
    );
  }, [debouncedSearch]);

  return {
    search: _search,
    onSearch: onSearchChange,
  };
};
