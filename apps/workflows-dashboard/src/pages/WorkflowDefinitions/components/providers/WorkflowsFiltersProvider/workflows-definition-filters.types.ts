import { IWorkflowStatus } from '@/domains/workflows/api/workflow';

export interface WorkflowDefinitionsFilterValues {
  status?: IWorkflowStatus[];
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  fromDate?: number;
}

export type WorkflowFiltersUpdater = (filters: Partial<WorkflowDefinitionsFilterValues>) => void;

export interface WorkflowDefinitionFiltersContext {
  filters: WorkflowDefinitionsFilterValues;
  updateFilters: WorkflowFiltersUpdater;
}
