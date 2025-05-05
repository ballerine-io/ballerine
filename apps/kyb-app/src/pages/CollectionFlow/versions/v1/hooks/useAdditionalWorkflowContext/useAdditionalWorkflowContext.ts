import { useMemo } from 'react';

import { useWorkflowId } from '@/common/hooks/useWorkflowId';
import { useAccessToken } from '@/common/providers/AccessTokenProvider';

export const useAdditionalWorkflowContext = () => {
  const { accessToken } = useAccessToken();
  const workflowId = useWorkflowId();

  return useMemo(() => {
    return {
      query: {
        token: accessToken,
      },
      param: {
        workflowId,
      },
    };
  }, [workflowId, accessToken]);
};
