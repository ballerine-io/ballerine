import { AnyArray, TKeyofArrayElement, TRouteId } from "@/types";
import { useNavigate, useSearch as useTanStackSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "hooks/useDebounce/useDebounce";
import { search as onSearch } from "./search";

export const useSearch = <TArray extends AnyArray, TId extends TRouteId>({
  routeId,
  data,
  searchBy,
  initialSearch = '',
}: {
  routeId: TId;
  data: TArray;
  searchBy: Array<TKeyofArrayElement<TArray>>;
  initialSearch?: string;
}) => {
  const navigate = useNavigate({
    from: routeId,
  });
  const { search = initialSearch } = useTanStackSearch({
    from: routeId,
    strict: false,
    track: searchParams => ({
      search: 'search' in searchParams ? searchParams.search : undefined,
    }),
  });
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
    // @ts-ignore
    navigate({
      // @ts-ignore
      search: prevState => ({
        ...prevState,
        search: debouncedSearch,
      }),
    });
  }, [debouncedSearch]);

  return {
    searched,
    search: _search,
    searchBy,
    onSearch: onSearchChange,
  };
};
