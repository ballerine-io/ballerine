import { IWorkflowStatus } from '@/domains/workflows/api/workflow';

export interface WorkflowsFiltersValues {
  status?: IWorkflowStatus[];
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  fromDate?: number;
}
