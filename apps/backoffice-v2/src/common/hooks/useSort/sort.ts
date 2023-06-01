import { AnyArray, TKeyofArrayElement } from '../../types';

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
    : data?.slice().sort((a, b) => {
        const aValue = String(a[sortBy]);
        const bValue = String(b[sortBy]);

        if (sortDir === 'asc') {
          return aValue.localeCompare(bValue);
        }

        return bValue.localeCompare(aValue);
      });
