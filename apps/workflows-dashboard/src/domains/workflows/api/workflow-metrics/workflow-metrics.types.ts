import { IWorkflowStatus } from '@app/domains/workflows/api/workflow/workflow.types';

export type WorkflowStatsPerStatus = Record<IWorkflowStatus, number>;
export interface IWorkflowDefinitionStats {
  id: string;
  name: string;
  stats: WorkflowStatsPerStatus;
}

export interface IAgentCasesStats {
  id: string;
  firstName: string;
  lastName: string;
  casesCount: number;
}

export type ICasesPerStatusStats = Record<IWorkflowStatus, number>;

export interface GetAgentCasesStatsDto {
  // UNIX timestamp
  fromDate?: number;
}

export interface GetCasesPerStatusDto {
  // UNIX timestamp
  fromData?: number;
}
