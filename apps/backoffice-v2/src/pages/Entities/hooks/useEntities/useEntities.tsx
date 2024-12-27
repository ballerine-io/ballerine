import { useCaseCreationWorkflowDefinition } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition';
import { ChangeEventHandler, useCallback } from 'react';
import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';
import { useSearch } from '../../../../common/hooks/useSearch/useSearch';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { createArrayOfNumbers } from '../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import { useSelectEntityOnMount } from '../../../../domains/entities/hooks/useSelectEntityOnMount/useSelectEntityOnMount';
import { useWorkflowsQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';
import { usePagination } from '@/common/hooks/usePagination/usePagination';

export const useEntities = () => {
  const { search, onSearch } = useSearch();
  const [{ filterId, filter, sortBy, sortDir, page, pageSize }, setSearchParams] =
    useSearchParamsByEntity();

  const { data, isLoading } = useWorkflowsQuery({
    filterId,
    filter,
    sortBy,
    sortDir,
    page,
    pageSize,
    search,
  });
  const cases = data?.data;
  const totalPages = data?.meta?.totalPages ?? 0;
  const entity = useEntityType();

  const onSortDirToggle = useCallback(() => {
    setSearchParams({
      sortDir: sortDir === 'asc' ? 'desc' : 'asc',
    });
  }, [setSearchParams, sortDir]);

  const onSortBy = useCallback(
    (sortBy: string) => {
      setSearchParams({
        sortBy,
      });
    },
    [setSearchParams],
  );

  const onFilterChange = useCallback(
    (key: string) => {
      return (values: string[]) => {
        setSearchParams({
          filter: {
            ...filter,
            [key]: values,
          },
          page: 1,
        });
      };
    },
    [filter, setSearchParams],
  );

  const { onPaginate, onPrevPage, onNextPage, onLastPage, isLastPage } = usePagination({
    totalPages: data?.meta?.totalPages ?? 0,
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
  const skeletonEntities = createArrayOfNumbers(3);

  useSelectEntityOnMount();

  const { workflowDefinition } = useCaseCreationWorkflowDefinition();

  const isNoCases = !isLoading && Array.isArray(cases) && !cases.length;

  return {
    onPaginate,
    onPrevPage,
    onNextPage,
    onLastPage,
    isLastPage,
    onSearch: onSearchChange,
    onFilter: onFilterChange,
    onSortBy: onSortByChange,
    onSortDirToggle,
    search,
    cases,
    caseCount: data?.meta?.totalItems || 0,
    isLoading,
    page,
    totalPages,
    skeletonEntities,
    entity,
    isManualCaseCreationEnabled: workflowDefinition?.config?.enableManualCreation,
    isNoCases,
  };
};
