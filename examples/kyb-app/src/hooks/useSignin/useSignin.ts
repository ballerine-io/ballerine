import { useCallback } from 'react';

export const useSignin = () => {
  const logout = useCallback(() => {
    location.href = '/';
  }, []);

  return {
    logout,
  };
};
