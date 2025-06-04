import { IHttpParams, useHttp } from '@/common/hooks/useHttp';
import { useDynamicForm } from '../../../context';
import { useMemo } from 'react';

export const useFormHttp = (params: IHttpParams) => {
  const { httpParams, metadata } = useDynamicForm();

  const mergedParams = useMemo(() => {
    return {
      ...params,
      headers: {
        ...params.headers,
        ...httpParams?.headers,
      },
      params: {
        ...params.params,
        ...httpParams?.params,
      },
    };
  }, [httpParams, params]);

  return useHttp(mergedParams, metadata);
};
