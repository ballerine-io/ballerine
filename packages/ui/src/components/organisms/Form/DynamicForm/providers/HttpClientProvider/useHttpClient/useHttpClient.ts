import { useContext } from 'react';
import { HttpClientProviderContext } from '../HttpClientProviderContext';
import { THttpClient } from '../types';

export const useHttpClient = (): THttpClient => {
  const { httpClient } = useContext(HttpClientProviderContext);

  if (!httpClient) {
    throw new Error('HttpClientProviderContext not found');
  }

  return httpClient;
};
