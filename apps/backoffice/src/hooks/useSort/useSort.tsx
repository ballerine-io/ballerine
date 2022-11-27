import { useState } from 'react';
import { KeyOption, matchSorter } from 'match-sorter';

/**
 * @description A hook to easily sort an array of objects by key, and change sort direction or the sort by key.
 * @param props
 * @param props.data - The data to sort.
 * @param props.initialState - An object of the initial sorting direction and sort by state.
 */
export const useSort = <TRecord extends Record<PropertyKey, any>>({
  data,
  initialState,
}: {
  data: Array<TRecord>;
  initialState: {
    sortDir?: 'asc' | 'desc';
    sortBy: Array<keyof TRecord>;
  };
}) => {
  const [sortDir, setSortDir] = useState(initialState.sortDir ?? 'asc');
  const [sortBy, setSortBy] = useState(initialState.sortBy);
  const onSortDir = () => setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
  const onSortBy = (sortBy: Array<keyof TRecord>) => setSortBy(sortBy);
  // Sort
  const sorted =
    // Avoid errors stemming from calling array methods on non-arrays or empty arrays.
    !Array.isArray(data) || !data?.length
      ? []
      : matchSorter(data, '', {
          keys: sortBy as ReadonlyArray<KeyOption<TRecord>>,
          // Handle sort direction
          baseSort: (a, b) => {
            const aValue = String(a.rankedValue);
            const bValue = String(b.rankedValue);

            if (sortDir === 'asc') {
              return aValue.localeCompare(bValue);
            }

            return bValue.localeCompare(aValue);
          },
        });

  return {
    sorted,
    sortDir,
    sortBy,
    onSortDir,
    onSortBy,
  };
};
