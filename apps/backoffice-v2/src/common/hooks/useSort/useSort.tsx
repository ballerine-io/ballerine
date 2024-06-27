import { useCallback } from 'react';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { SortDirection } from '@ballerine/common';

export const useSort = () => {
  const [{ sortBy, sortDir }, setSearchParams] = useSerializedSearchParams();

  const onSortDir = useCallback(
    (next?: SortDirection) => {
      setSearchParams({
        sortDir: next ? next : sortDir === 'asc' ? 'desc' : 'asc',
      });
    },
    [setSearchParams, sortDir],
  );

  const onSortBy = useCallback(
    (sortBy: string) => {
      setSearchParams({
        sortBy,
      });
    },
    [setSearchParams],
  );

  const onSort = useCallback(
    ({ sortBy, sortDir }: { sortBy: string; sortDir: SortDirection }) => {
      setSearchParams({
        sortBy,
        sortDir,
      });
    },
    [setSearchParams],
  );

  return {
    onSortDir,
    onSortBy,
    onSort,
    sortDir,
    sortBy,
  };
};
