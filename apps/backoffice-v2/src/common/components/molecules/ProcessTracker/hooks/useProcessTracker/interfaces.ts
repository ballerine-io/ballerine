import { TWorkflowById } from '@/domains/workflows/fetchers';

export interface IUseProcessTrackerLogicParams {
  workflow: TWorkflowById;
  processes: string[];
}
