import { useMatches } from '@tanstack/react-router';
import { useSort } from '@/hooks/useSort/useSort';
import { useSearch } from '@/hooks/useSearch/useSearch';
import { useFilter } from '@/hooks/useFilter/useFilter';
import { usePagination } from '@/hooks/usePagination/usePagination';
import { ChangeEventHandler, useCallback } from 'react';
import { TEndUser } from '@/api/types';
import { createArrayOfNumbers } from '@/utils/create-array-of-numbers/create-array-of-numbers';
import { TRouteId } from '@/types';
import { useSelectEndUserOnMount } from '@/hooks/useSelectEndUserOnMount/useSelectEndUserOnMount';
import { individualsRoute } from '@/components/pages/Individuals/Individuals.route';
import { individualsIndexRoute } from '@/components/pages/Individuals/IndividualsIndex.route';
import { individualRoute } from '@/components/pages/Individual/Individual.route';
import { useEndUsersWithWorkflowQuery } from '@/lib/react-query/queries/useEndUsersWithWorkflowQuery/useEndUsersWithWorkflowQuery';

export const useIndividuals = () => {
  const matches = useMatches();
  const lastMatchId = matches.at(-1)?.route?.id;
  const isIndividuals =
    lastMatchId === individualsRoute.id || lastMatchId === individualsIndexRoute.id;
  const routeId: TRouteId = isIndividuals ? individualsRoute.id : individualRoute.id;
  const { data: subjects, isLoading } = useEndUsersWithWorkflowQuery();
  const { searched, onSearch, search } = useSearch({
    routeId,
    data: subjects,
    searchBy: ['firstName', 'lastName', 'email', 'phone'],
  });
  const { sorted, onSortBy, onSortDir } = useSort({
    routeId,
    data: searched,
    initialState: {
      sortBy: 'createdAt',
    },
  });
  const { filtered, onFilter } = useFilter({
    routeId,
    data: sorted,
  });
  const { paginated, page, pages, totalPages, onPaginate } = usePagination({
    routeId,
    data: filtered,
    initialPageSize: 10,
    initialPage: 1,
  });
  const onSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      onSearch(e.target.value);
    },
    [onSearch],
  );
  const onSortByChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    e => {
      onSortBy(e.target.value);
    },
    [onSortBy],
  );
  const onFilterChange = useCallback(
    (key: keyof TEndUser) => (values: Array<string>) => {
      onFilter({
        [key]: values,
      });
    },
    [onFilter],
  );
  const skeletons = createArrayOfNumbers(3);

  useSelectEndUserOnMount();

  return {
    onPaginate,
    onSearch: onSearchChange,
    onFilter: onFilterChange,
    onSortBy: onSortByChange,
    onSortDir,
    search,
    subjects: paginated,
    isLoading,
    page,
    pages,
    totalPages,
    skeletons,
  };
};
