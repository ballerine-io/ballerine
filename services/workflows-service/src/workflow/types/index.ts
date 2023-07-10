import { SortOrder } from '@/common/query-filters/sort-order';
import { WorkflowRuntimeListItemModel } from '@/workflow/workflow-runtime-list-item.model';
import {
  Business,
  EndUser,
  WorkflowDefinition,
  WorkflowRuntimeData,
  WorkflowRuntimeDataStatus,
} from '@prisma/client';
import { User } from '@sentry/node';

export interface RunnableWorkflowData {
  workflowDefinition: WorkflowDefinition;
  workflowRuntimeData: WorkflowRuntimeData;
  ballerineEntityId?: string | null;
}

export type CompleteWorkflowData = WorkflowRuntimeData & {
  workflowDefinition: WorkflowDefinition;
};

export type TEntityType = 'endUser' | 'business';

export type TWorkflowWithRelations = WorkflowRuntimeData & {
  workflowDefinition: WorkflowDefinition;
  assignee: User;
} & ({ endUser: EndUser } | { business: Business });

export interface ListWorkflowsRuntimeParams {
  page?: number;
  size?: number;
  status?: WorkflowRuntimeDataStatus[];
  orderBy?: string;
  orderDirection?: SortOrder;
}

export interface ListRuntimeDataResult {
  results: WorkflowRuntimeListItemModel[];
  meta: {
    pages: number;
    total: number;
  };
}

export type WorkflowRuntimeListQueryResult = WorkflowRuntimeData & {
  workflowDefinition: WorkflowDefinition;
  assignee: User | null;
};

export type WorkflowsApprovedChart = { workflowId: string; approvedDate: Date }[];

export type WorkflowDefinitionStatsPerStatus = Record<WorkflowRuntimeDataStatus, number>;
export interface WorkflowDefinitionStats {
  id: string;
  name: string;
  stats: WorkflowDefinitionStatsPerStatus;
}

export interface WorkflowRuntimeAgentStats {
  id: string;
  firstName: string;
  lastName: string;
  casesCount: number;
}

export interface ListWorkflowRuntimeAgentCasesStatsParams {
  fromDate?: Date;
}

export type WorkflowRuntimeCasesPerStatus = Record<WorkflowRuntimeDataStatus, number>;

export interface GetWorkflowRuntimeCasesPerStatusParams {
  fromDate?: Date;
}

export interface GetUserStatsParams {
  fromDate?: Date | null;
}
