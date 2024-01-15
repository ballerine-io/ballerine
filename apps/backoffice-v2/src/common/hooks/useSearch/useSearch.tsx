import { AnyArray, TKeyofArrayElement } from '../../types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../useDebounce/useDebounce';
import { search as onSearch } from './search';
import { useSearchParamsByEntity } from '../useSearchParamsByEntity/useSearchParamsByEntity';

export const useSearch = <TArray extends AnyArray>({
  data,
  searchBy,
  initialSearch = '',
}: {
  data: TArray;
  searchBy: Array<TKeyofArrayElement<TArray>>;
  initialSearch?: string;
}) => {
  const [{ search = initialSearch }, setSearchParams] = useSearchParamsByEntity();
  const searched = useMemo(
    () =>
      onSearch({
        data,
        searchBy,
        search,
      }),
    [data, searchBy, search],
  );
  const [_search, setSearch] = useState(search);
  const debouncedSearch = useDebounce(_search, 240);
  const onSearchChange = useCallback((search: string) => {
    setSearch(search);
  }, []);

  useEffect(() => {
    setSearchParams({
      search: debouncedSearch,
      page: 1,
    });
  }, [debouncedSearch]);

  return {
    searched,
    search: _search,
    searchBy,
    onSearch: onSearchChange,
  };
};
