import { AnyObject } from '@/common';
import { TCommonHttpParams } from '../../types';
import { useMemo } from 'react';
import axios, { AxiosRequestHeaders } from 'axios';
import { formatString } from '../../utils/format-string';
import { HttpClientProviderContext } from './HttpClientProviderContext';

interface IHttpClientProvider {
  httpParams: TCommonHttpParams | undefined;
  metadata: AnyObject | undefined;
  children: React.ReactNode;
}

export const HttpClientProvider = ({ httpParams, children, metadata }: IHttpClientProvider) => {
  const httpClient = useMemo(() => {
    const axiosClient = axios.create({
      baseURL: formatString('{_app.apiUrl}', metadata || {}),
    });

    axiosClient.interceptors.request.use(config => {
      if (config.headers) {
        config.headers = {
          ...config.headers,
          ...(httpParams?.headers || {}),
        } as AxiosRequestHeaders;

        config.params = {
          ...config.params,
          ...(httpParams?.params || {}),
        } as AnyObject;
      }

      return config;
    });

    return axiosClient;
  }, [httpParams, metadata]);

  const context = useMemo(() => ({ httpClient }), [httpClient]);

  return (
    <HttpClientProviderContext.Provider value={context}>
      {children}
    </HttpClientProviderContext.Provider>
  );
};
