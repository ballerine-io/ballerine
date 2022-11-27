import { useCallback, useState } from 'react';
import { KeyOption, matchSorter } from 'match-sorter';

export const useSearch = <TRecord extends Record<PropertyKey, any>>({
  data,
  searchBy,
  initialState = '',
}: {
  data: Array<TRecord>;
  initialState?: string;
  searchBy: Array<keyof TRecord>;
}) => {
  const [search, setSearch] = useState(initialState);
  const onSearch = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch],
  );
  const searched = (() => {
    // Avoid errors stemming from calling array methods on non-arrays.
    if (!Array.isArray(data)) {
      return [];
    }

    // Don't filter when not needed.
    if (!search || !data?.length) {
      return data;
    }

    // Split words
    const terms = search.split(' ');

    if (!terms) {
      return data;
    }

    // Fuzzy search
    return terms.reduceRight(
      (results, term) =>
        matchSorter(results, term, {
          keys: searchBy as ReadonlyArray<KeyOption<TRecord>>,
        }),
      data,
    );
  })();

  return {
    searched,
    search,
    onSearch,
  };
};
