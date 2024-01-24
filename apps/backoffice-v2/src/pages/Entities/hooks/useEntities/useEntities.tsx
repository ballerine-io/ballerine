import { useCaseCreationWorkflowDefinition } from '@/pages/Entities/components/CaseCreation/hooks/useCaseCreationWorkflowDefinition';
import { ChangeEventHandler, useCallback } from 'react';
import { useEntityType } from '../../../../common/hooks/useEntityType/useEntityType';
import { useSearch } from '../../../../common/hooks/useSearch/useSearch';
import { useSearchParamsByEntity } from '../../../../common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { createArrayOfNumbers } from '../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import { useSelectEntityOnMount } from '../../../../domains/entities/hooks/useSelectEntityOnMount/useSelectEntityOnMount';
import { useWorkflowsQuery } from '../../../../domains/workflows/hooks/queries/useWorkflowsQuery/useWorkflowsQuery';

export const useEntities = () => {
  const [{ filterId, filter, sortBy, sortDir, page, pageSize, search }, setSearchParams] =
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

  const {
    meta: { totalPages },
    data: workflows,
  } = data || { meta: { totalPages: 0 }, data: [] };
  const entity = useEntityType();
  const individualsSearchOptions = ['entity.name', 'entity.email'];
  const businessesSearchOptions = ['entity.name'];
  const { onSearch, search: searchValue } = useSearch({
    data: workflows,
    searchBy: entity === 'individuals' ? individualsSearchOptions : businessesSearchOptions,
  });

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

  const onPaginate = useCallback(
    (page: number) => () => {
      setSearchParams({
        page,
        pageSize,
      });
    },
    [pageSize, setSearchParams],
  );

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

  return {
    onPaginate,
    onSearch: onSearchChange,
    onFilter: onFilterChange,
    onSortBy: onSortByChange,
    onSortDirToggle,
    showCaseCreation: workflowDefinition?.config?.enableManualCreation,
    search: searchValue,
    cases: data?.data,
    caseCount: data?.meta?.totalItems || 0,
    isLoading,
    page,
    totalPages,
    skeletonEntities,
    entity,
  };
};
