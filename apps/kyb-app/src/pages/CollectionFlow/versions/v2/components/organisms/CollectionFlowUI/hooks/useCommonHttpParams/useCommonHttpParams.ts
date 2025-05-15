import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TCommonHttpParams } from '@ballerine/ui';

export const useCommonHttpParams = () => {
  const [searchParams] = useSearchParams();

  const commonHttpParams: TCommonHttpParams = useMemo(() => {
    const accessToken = searchParams.get('token');
    const workflowId = searchParams.get('workflowId');

    return {
      headers: {
        Authorization: `Bearer ${accessToken || null}`,
      },
      params: {
        ...(workflowId && { workflowId }),
      },
    };
  }, [searchParams]);

  return commonHttpParams;
};
