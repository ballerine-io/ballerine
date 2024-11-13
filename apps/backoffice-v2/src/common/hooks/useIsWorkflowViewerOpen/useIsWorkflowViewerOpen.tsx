import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';

export const useIsWorkflowViewerOpen = () => {
  const { search } = useLocation();
  const [{ isWorkflowOpen }] = useSerializedSearchParams();

  return useCallback(() => {
    const searchParams = new URLSearchParams(search);

    searchParams.set('isWorkflowOpen', isWorkflowOpen === 'true' ? 'false' : 'true');

    return searchParams.toString();
  }, [search, isWorkflowOpen]);
};
