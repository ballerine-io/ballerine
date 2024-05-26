import { useCallback, useState } from 'react';

export const useCommentInput = () => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const clear = useCallback(() => {
    setValue('');
  }, []);

  return {
    value,
    handleChange,
    clear,
  };
};
