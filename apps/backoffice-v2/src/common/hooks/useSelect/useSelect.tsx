import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useCallback } from 'react';

export const useSelect = () => {
  const [{ selected }, setSearchParams] = useSerializedSearchParams();

  const onSelect = useCallback(
    (ids: Record<string, boolean>) => {
      setSearchParams({
        selected: ids,
      });
    },
    [setSearchParams],
  );

  const onClearSelect = useCallback(() => {
    setSearchParams({
      selected: {},
    });
  }, [setSearchParams]);

  return {
    selected,
    onSelect,
    onClearSelect,
  };
};
