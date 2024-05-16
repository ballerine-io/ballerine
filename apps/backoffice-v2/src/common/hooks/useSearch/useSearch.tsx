import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '../useDebounce/useDebounce';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useIsMounted } from '@/common/hooks/useIsMounted/useIsMounted';

export const useSearch = (
  {
    initialSearch = '',
  }: {
    initialSearch?: string;
  } = {
    initialSearch: '',
  },
) => {
  const [{ search = initialSearch }, setSearchParams] = useSerializedSearchParams();
  const [_search, setSearch] = useState(search);
  const debouncedSearch = useDebounce(_search, 240);
  const onSearchChange = useCallback((search: string) => {
    setSearch(search);
  }, []);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    setSearchParams({
      search: debouncedSearch,
      page: '1',
    });
  }, [debouncedSearch]);

  return {
    search: _search,
    onSearch: onSearchChange,
  };
};
