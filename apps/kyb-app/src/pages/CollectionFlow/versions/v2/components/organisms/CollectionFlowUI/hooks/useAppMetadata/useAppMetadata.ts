import { getAccessToken } from '@/helpers/get-access-token.helper';
import { useMemo } from 'react';

export const useAppMetadata = () => {
  return useMemo(
    () => ({
      apiUrl: import.meta.env.VITE_API_URL,
      accessToken: getAccessToken() || null,
    }),
    [],
  );
};
