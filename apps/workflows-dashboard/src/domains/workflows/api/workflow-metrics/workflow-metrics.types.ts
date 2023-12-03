import { IWorkflowStatus } from '@/domains/workflows/api/workflow/workflow.types';

export type WorkflowStatsPerStatus = Record<IWorkflowStatus, number>;
export interface IWorkflowDefinitionStats extends WorkflowStatsPerStatus {
  id: string;
  name: string;
}

export interface IAgentCasesStats {
  id: string;
  firstName: string;
  lastName: string;
  casesCount: number;
}

export type ICasesPerStatusStats = Record<IWorkflowStatus, number>;

export interface GetCasesPerStatusDto {
  // UNIX timestamp
  fromDate?: number;
}
