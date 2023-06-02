import { AnyArray, TKeyofArrayElement } from '../../types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../useDebounce/useDebounce';
import { search as onSearch } from './search';
import { z } from 'zod';
import { useZodSearchParams } from '../useZodSearchParams/useZodSearchParams';

export const useSearch = <TArray extends AnyArray>({
  data,
  searchBy,
  initialSearch = '',
}: {
  data: TArray;
  searchBy: Array<TKeyofArrayElement<TArray>>;
  initialSearch?: string;
}) => {
  const [{ search = initialSearch }, setSearchParams] = useZodSearchParams(
    z.object({
      search: z.string().catch(''),
    }),
  );
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
    });
  }, [debouncedSearch, setSearchParams]);

  return {
    searched,
    search: _search,
    searchBy,
    onSearch: onSearchChange,
  };
};
