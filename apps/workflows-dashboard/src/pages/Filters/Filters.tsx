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
import { Button } from '@/components/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkflowDefinitionsQuery } from '../WorkflowDefinitions/hooks/useWorkflowDefinitionsQuery';
import { createFilter } from '@/domains/filters/filters.api';
import { CreateFilterDto } from '@/domains/filters/filters.types';

export const Filters = withFilters<FiltersProps<FiltersPageFilterValues>, FiltersPageFilterValues>(
  ({ filters }) => {
    const { data, isLoading } = useFiltersQuery(filters);
    const { handlePageChange, page, total } = useFiltersPagePagination();
    const [isOpen, setIsOpen] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [selectedWorkflow, setSelectedWorkflow] = useState('');

    const { data: workflowDefinitions } = useWorkflowDefinitionsQuery();

    const queryClient = useQueryClient();

    const createFilterMutation = useMutation({
      mutationFn: async (data: CreateFilterDto) => {
        return await createFilter(data);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['filters'] });
        setIsOpen(false);
        setFilterName('');
        setSelectedWorkflow('');
      },
    });

    const handleSubmit = () => {
      if (!filterName || !selectedWorkflow) return;

      createFilterMutation.mutate({
        name: filterName,
        entity: 'businesses',
        projectId: data?.items[0]?.projectId ?? '',
        query: {
          where: {
            businessId: {
              not: null,
            },
            workflowDefinitionId: {
              in: [selectedWorkflow],
            },
          },
          select: {
            id: true,
            tags: true,
            state: true,
            status: true,
            context: true,
            assignee: {
              select: {
                id: true,
                lastName: true,
                avatarUrl: true,
                firstName: true,
              },
            },
            business: {
              select: {
                id: true,
                email: true,
                address: true,
                website: true,
                industry: true,
                createdAt: true,
                documents: true,
                legalForm: true,
                updatedAt: true,
                vatNumber: true,
                companyName: true,
                phoneNumber: true,
                approvalState: true,
                businessPurpose: true,
                numberOfEmployees: true,
                registrationNumber: true,
                dateOfIncorporation: true,
                shareholderStructure: true,
                countryOfIncorporation: true,
                taxIdentificationNumber: true,
              },
            },
            createdAt: true,
            assigneeId: true,
            workflowDefinition: {
              select: {
                id: true,
                name: true,
                config: true,
                version: true,
                definition: true,
                contextSchema: true,
                documentsSchema: true,
              },
            },
            childWorkflowsRuntimeData: true,
          },
        },
      });
    };

    return (
      <DashboardLayout pageName="Case Lists">
        <WorkflowsLayout>
          <div className="mb-4 flex justify-end">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Create Case List</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Case List</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Input
                    placeholder="Case List Name"
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                  />
                  <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow definition" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowDefinitions?.items.map(def => (
                        <SelectItem key={def.id} value={def.id}>
                          {def.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSubmit}
                    disabled={!filterName || !selectedWorkflow || createFilterMutation.isLoading}
                  >
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
