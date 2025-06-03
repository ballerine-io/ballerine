import { useMemo } from 'react';

export const useAppMetadata = () => {
  return useMemo(
    () => ({
      apiUrl: import.meta.env.VITE_API_URL,
    }),
    [],
  );
};
