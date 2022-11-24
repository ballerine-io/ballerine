import { useCallback, useState } from 'react';

/**
 * @description A hook to easily filter an array of objects by key using fuzzy search.
 * @param props
 * @param props.data - The data to filter.
 * @param props.initialState - The initial filter - defaults to empty string.
 * @param props.filterBy - The object keys to filter by.
 */
export const useFilter = <TRecord extends Record<PropertyKey, any>>({
  data,
  initialState,
}: {
  data: Array<TRecord>;
  initialState?: Record<keyof TRecord, Array<string>>;
}) => {
  const [filter, setFilter] = useState(initialState);
  const onFilter = useCallback(
    (value: Record<keyof TRecord, Array<string>>) => {
      setFilter(prevState => ({
        ...prevState,
        ...value,
      }));
    },
    [setFilter],
  );
  const filtered = (() => {
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!filter?.[term]?.length) return true;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        return filter?.[term]?.some(termValue => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
          return item?.[term]?.includes(termValue);
        });
      });
    });
  })();

  return {
    filtered,
    filter,
    onFilter,
  };
};
