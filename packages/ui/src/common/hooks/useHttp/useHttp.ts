import { AnyObject } from '@/common/types';
import get from 'lodash/get';
import { useCallback, useState } from 'react';
import { IHttpParams } from './types';
import { request } from './utils/request';

export const useHttp = (params: IHttpParams, metadata: AnyObject) => {
  const [responseError, setResponseError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runRequest = useCallback(
    async (requestPayload?: any) => {
      setIsLoading(true);
      setResponseError(null);

      try {
        const response = await request(params, metadata, requestPayload);

        return params.resultPath ? get(response, params.resultPath) : response;
      } catch (error) {
        setResponseError(error as Error);
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
