import { useMatches } from '@tanstack/react-router';
import { useSearch } from '../../../../common/hooks/useSearch/useSearch';
import { useFilter } from '../../../../common/hooks/useFilter/useFilter';
import { usePagination } from '../../../../common/hooks/usePagination/usePagination';
import { ChangeEventHandler, useCallback } from 'react';
import { createArrayOfNumbers } from '../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import { TRouteId } from '../../../../common/types';
import { useSelectEntityOnMount } from '../../../../domains/entities/hooks/useSelectEntityOnMount/useSelectEntityOnMount';
import { entitiesRoute } from '../../Entities.route';
import { entitiesIndexRoute } from '../../EntitiesIndex.route';
import { entityRoute } from '../../../Entity/Entity.route';
import { useUsersQuery } from '../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useSort } from '../../../../common/hooks/useSort/useSort';
import { useEntitiesWithWorkflowsQuery } from '../../../../domains/entities/hooks/queries/useEntitiesWithWorkflowsQuery/useEntitiesWithWorkflowsQuery';
import { TIndividual } from '../../../../domains/individuals/types';
import { useFilterEntity } from '../../../../domains/entities/hooks/useFilterEntity/useFilterEntity';

export const useEntities = () => {
  const matches = useMatches();
  const lastMatchId = matches.at(-1)?.route?.id;
  const isIndividuals = lastMatchId === entitiesRoute.id || lastMatchId === entitiesIndexRoute.id;
  const routeId: TRouteId = isIndividuals ? entitiesRoute.id : entityRoute.id;
  const { data: users } = useUsersQuery();
  const { data: cases, isLoading } = useEntitiesWithWorkflowsQuery(users);
  const entity = useFilterEntity();
  const individualsSearchOptions = ['firstName', 'lastName', 'email', 'phone'];
  const businessesSearchOptions = [
    'companyName',
    'registrationNumber',
    'legalForm',
    'countryOfIncorporation',
  ];
  const { searched, onSearch, search } = useSearch({
    routeId,
    data: cases,
    searchBy: entity === 'individuals' ? individualsSearchOptions : businessesSearchOptions,
  });
  const { sorted, onSortBy, onSortDir } = useSort({
    routeId,
    data: searched,
    initialState: {
      sortBy: 'caseCreatedAt',
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
  const skeletonEntities = createArrayOfNumbers(3);

  useSelectEntityOnMount();

  return {
    onPaginate,
    onSearch: onSearchChange,
    onFilter: onFilterChange,
    onSortBy: onSortByChange,
    onSortDir,
    search,
    cases: paginated,
    isLoading,
    page,
    pages,
    totalPages,
    skeletonEntities,
    routeId,
  };
};
