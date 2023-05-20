import { useMatches } from '@tanstack/react-router';
import { useSearch } from 'hooks/useSearch/useSearch';
import { useFilter } from 'hooks/useFilter/useFilter';
import { usePagination } from 'hooks/usePagination/usePagination';
import { ChangeEventHandler, useCallback } from 'react';
import { createArrayOfNumbers } from '../../../../../utils/create-array-of-numbers/create-array-of-numbers';
import { TRouteId } from '../../../../../types';
import { useSelectEntityOnMount } from '../../../../../entities/hooks/useSelectEntityOnMount/useSelectEntityOnMount';
import { individualsRoute } from '../../Individuals.route';
import { individualsIndexRoute } from '../../IndividualsIndex.route';
import { individualRoute } from '../../../Individual/Individual.route';
import { useUsersQuery } from '../../../../../lib/react-query/queries/useUsersQuery/useUsersQuery';
import { useSort } from 'hooks/useSort/useSort';
import { useEntitiesWithWorkflowsQuery } from '../../../../../entities/hooks/queries/useEntitiesWithWorkflowsQuery/useEntitiesWithWorkflowsQuery';
import { TIndividual } from '../../../../../individuals/types';

export const useIndividuals = () => {
  const matches = useMatches();
  const lastMatchId = matches.at(-1)?.route?.id;
  const isIndividuals =
    lastMatchId === individualsRoute.id || lastMatchId === individualsIndexRoute.id;
  const routeId: TRouteId = isIndividuals ? individualsRoute.id : individualRoute.id;
  const { data: users } = useUsersQuery();
  const { data: subjects, isLoading } = useEntitiesWithWorkflowsQuery(users);
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
    event => {
      onSearch(event.target.value);
    },
    [onSearch],
  );
  const onSortByChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    event => {
      onSortBy(event.target.value);
    },
    [onSortBy],
  );
  const onFilterChange = useCallback(
    (key: keyof TIndividual) => (values: Array<string>) => {
      onFilter({
        [key]: values,
      });
    },
    [onFilter],
  );
  const skeletons = createArrayOfNumbers(3);

  useSelectEntityOnMount();

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
    routeId,
  };
};
