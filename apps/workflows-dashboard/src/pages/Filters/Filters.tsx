import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Pagination } from '@/components/molecules/Pagination';
import { withFilters } from '@/components/providers/FiltersProvider/hocs/withFilters';
import { FiltersProps } from '@/components/providers/FiltersProvider/hocs/withFilters/types';
import { FiltersTable } from '@/pages/Filters/components/FiltersTable';
import { deserializeQueryParams } from '@/pages/Filters/helpers/deserialize-query-params';
import { useFiltersPagePagination } from '@/pages/Filters/hooks/useFiltersPagePagination';
import { useFiltersQuery } from '@/pages/Filters/hooks/useFiltersQuery';
import { FiltersPageFilterValues } from '@/pages/Filters/types/filters-filter-values';
import { WorkflowsLayout } from '@/pages/Workflows/components/layouts/WorkflowsLayout';
import { NumberParam, withDefault } from 'use-query-params';

export const Filters = withFilters<FiltersProps<FiltersPageFilterValues>, FiltersPageFilterValues>(
  ({ filters }) => {
    const { data, isLoading } = useFiltersQuery(filters);
    const { handlePageChange, page, total } = useFiltersPagePagination();
    console.log({ page, total });

    return (
      <DashboardLayout pageName="Filters">
        <WorkflowsLayout>
          <WorkflowsLayout.Main>
            <FiltersTable items={data?.items || []} isFetching={isLoading} />
          </WorkflowsLayout.Main>
          <WorkflowsLayout.Footer>
            <Pagination totalPages={total} page={page} onChange={handlePageChange} />
          </WorkflowsLayout.Footer>
        </WorkflowsLayout>
      </DashboardLayout>
    );
  },
  {
    querySchema: {
      page: withDefault(NumberParam, 1),
      limit: withDefault(NumberParam, 20),
    },
    deserializer: deserializeQueryParams,
  },
);
