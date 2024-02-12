import { useCallback } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';

export const useFilter = () => {
  const [{ filter }, setSearchParams] = useSerializedSearchParams();

  const onFilter = useCallback(
    (accessor: string) => {
      return (values: string[]) => {
        setSearchParams({
          filter: {
            ...filter,
            [accessor]: values,
          },
          page: '1',
        });
      };
    },
    [filter, setSearchParams],
  );

  return {
    filter,
    onFilter,
  };
};
