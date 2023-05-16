import { AnyArray } from '../../types';

export const filter = <TArray extends AnyArray>({
  data,
  filter,
}: {
  data: TArray;
  filter: string;
}) => {
  // Avoid errors stemming from calling array methods on non-arrays.
  if (!Array.isArray(data)) {
    return [];
  }

  // Don't filter when not needed.
  if (!filter || !data?.length) {
    return data;
  }

  // Get filters
  const terms = Object.keys(filter);

  if (!terms?.length) {
    return data;
  }

  // Filter
  return data?.filter(item => {
    return terms?.every(term => {
      if (!filter?.[term]?.length) return true;

      return filter?.[term]?.some(termValue => {
        if (typeof item?.[term]?.includes === 'function') {
          return item?.[term]?.includes(termValue);
        }

        return item?.[term] === termValue;
      });
    });
  });
};
