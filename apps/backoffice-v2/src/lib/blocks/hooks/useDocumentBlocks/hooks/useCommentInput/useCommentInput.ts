import { useCallback, useState } from 'react';

export const useCommentInput = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const clear = useCallback(() => {
    setValue(undefined);
  }, []);

  return {
    value,
    handleChange,
    clear,
  };
};
