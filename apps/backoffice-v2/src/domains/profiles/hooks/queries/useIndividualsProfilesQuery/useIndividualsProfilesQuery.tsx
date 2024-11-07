import { individualsProfilesQueryKeys } from '../../../query-keys';
import { useQuery } from '@tanstack/react-query';

export const useIndividualsProfilesQuery = ({
  sortBy,
  sortDir,
  page,
  pageSize,
  search,
  filter,
}: {
  sortBy: string;
  sortDir: string;
  page: number;
  pageSize: number;
  search: string;
  filter: Record<string, unknown>;
}) => {
  return useQuery({
    ...individualsProfilesQueryKeys.list({
      sortBy,
      sortDir,
      page,
      pageSize,
      search,
      filter,
    }),
    staleTime: 1_000_000,
    refetchInterval: 1_000_000,
  });
};
