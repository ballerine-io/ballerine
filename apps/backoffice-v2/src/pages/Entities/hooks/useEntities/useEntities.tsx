import { useSearch } from '../../../../common/hooks/useSearch/useSearch';
import { useFilter } from '../../../../common/hooks/useFilter/useFilter';
import { usePagination } from '../../../../common/hooks/usePagination/usePagination';
import { ChangeEventHandler, useCallback } from 'react';
import { createArrayOfNumbers } from '../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import { useSort } from '../../../../common/hooks/useSort/useSort';
import { TIndividual } from '../../../../domains/individuals/types';
import { useFilterEntity } from '../../../../domains/entities/hooks/useFilterEntity/useFilterEntity';
import { useSelectEntityOnMount } from '../../../../domains/entities/hooks/useSelectEntityOnMount/useSelectEntityOnMount';
import { useWorkflowsQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';

export const useEntities = () => {
  const [{ filterId, sortBy, sortDir }] = useSearchParamsByEntity();
  const { data: cases, isLoading } = useWorkflowsQuery({ filterId, sortBy, sortDir });
  const entity = useFilterEntity();
  const individualsSearchOptions = ['firstName', 'lastName', 'email', 'phone'];
  const businessesSearchOptions = [
    'companyName',
    'registrationNumber',
    'legalForm',
    'countryOfIncorporation',
  ];
  const { searched, onSearch, search } = useSearch({
    data: cases,
    searchBy: entity === 'individuals' ? individualsSearchOptions : businessesSearchOptions,
  });
  const { onSortBy, onSortDir } = useSort({
    initialState: {
      sortBy: 'createdAt',
      sortDir: 'desc',
    },
  });
  const { filtered, onFilter } = useFilter({
    data: searched,
  });
  const { paginated, page, pages, totalPages, onPaginate } = usePagination({
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
    cases,
    isLoading,
    page,
    pages,
    totalPages,
    skeletonEntities,
    entity,
  };
};
