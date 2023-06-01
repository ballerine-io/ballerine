import { useEffect, useState } from 'react';

export const useDebounce = <TValue,>(value: TValue, debounce = 0) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, debounce);

    return () => {
      clearTimeout(handler);
    };
  }, [value, debounce]);

  return debouncedValue;
};
