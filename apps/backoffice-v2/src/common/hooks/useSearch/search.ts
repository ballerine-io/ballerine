import { AnyArray, TKeyofArrayElement } from '../../types';
import { KeyOption, matchSorter } from 'match-sorter';

export const search = <TArray extends AnyArray>({
  data,
  searchBy,
  search,
}: {
  data: TArray;
  searchBy: Array<TKeyofArrayElement<TArray>>;
  search: string;
}) => {
  // Avoid errors stemming from calling array methods on non-arrays.
  if (!Array.isArray(data)) {
    return [];
  }

  // Don't filter when not needed.
  if (!search || typeof search !== 'string' || !data?.length) {
    return data;
  }

  // Split words
  const terms = search?.split(' ');

  if (!terms) {
    return data;
  }

  // Fuzzy search
  return terms.reduceRight(
    (results, term) =>
      matchSorter(results, term, {
        keys: searchBy as ReadonlyArray<KeyOption<TKeyofArrayElement<TArray>>>,
      }),
    data,
  );
};
