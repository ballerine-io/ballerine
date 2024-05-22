import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { useCallback } from 'react';

export const useFilter = () => {
  const [{ filter }, setSearchParams] = useSerializedSearchParams();

  const onFilter = useCallback(
    (accessor: string) => {
      return (values: Array<string | null>) => {
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

  const onClear = useCallback((accessor: string) => {
    setSearchParams({
      filter: {
        ...filter,
        [accessor]: [],
      },
      page: '1',
    });
  }, []);

  return {
    filter,
    onClear,
    onFilter,
  };
};
