import { IWorkflowStatus } from '@/domains/workflows/api/workflow';

export interface WorkflowFilterValues {
  status?: IWorkflowStatus[];
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  fromDate?: number;
}

export type WorkflowFiltersUpdater = (filters: Partial<WorkflowFilterValues>) => void;

export interface WorkflowFiltersContext {
  filters: WorkflowFilterValues;
  updateFilters: WorkflowFiltersUpdater;
}
