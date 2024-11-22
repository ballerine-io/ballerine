import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';

export const useUpdateIsNotesOpen = () => {
  const { search } = useLocation();
  const [{ isNotesOpen }] = useSerializedSearchParams();

  return useCallback(() => {
    const searchParams = new URLSearchParams(search);

    searchParams.set('isNotesOpen', isNotesOpen === 'true' ? 'false' : 'true');

    return searchParams.toString();
  }, [search, isNotesOpen]);
};
