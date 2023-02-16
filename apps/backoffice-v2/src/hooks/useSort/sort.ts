import { AnyArray, TKeyofArrayElement } from '../../types';
import { KeyOption, matchSorter } from 'match-sorter';

export const sort = <TArray extends AnyArray>(
  {
    data,
    sortBy,
    sortDir,
  }: {
    data: TArray;
    sortBy: TKeyofArrayElement<TArray>;
    sortDir: 'asc' | 'desc';
  }, // Avoid errors stemming from calling array methods on non-arrays or empty arrays.
) =>
  !Array.isArray(data) || !data?.length
    ? []
    : matchSorter<TArray[number]>(data, '', {
        keys: [sortBy as KeyOption<TKeyofArrayElement<TArray>>],
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
