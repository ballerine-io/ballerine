import { AnyObject } from '@/common/types';
import get from 'lodash/get';
import { useCallback, useState } from 'react';
import { IHttpParams } from './types';
import { request } from './utils/request';

export const useHttp = (params: IHttpParams, metadata: AnyObject) => {
  const [responseError, setResponseError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runRequest = useCallback(
    async (
      requestPayload?: any,
      other?: {
        params?: AnyObject;
      },
    ) => {
      setIsLoading(true);
      setResponseError(null);

      try {
        const response = await request(
          {
            ...params,
            url: params.url,
          },
          metadata,
          requestPayload,
          other?.params,
        );

        return params.resultPath ? get(response, params.resultPath) : response;
      } catch (error) {
        console.error(error);
        setResponseError(error as Error);

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [params, metadata],
  );

  return {
    isLoading,
    error: responseError,
    run: runRequest,
  };
};
