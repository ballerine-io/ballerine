import { TPlugin } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export interface ProcessTrackerItem {
  text: string | JSX.Element | undefined;
  leftIcon: JSX.Element | undefined;
}

export abstract class IProcessTracker {
  abstract readonly PROCESS_NAME: string;

  constructor(readonly workflow: TWorkflowById, readonly plugins?: TPlugin[]) {}

  abstract buildItems(): ProcessTrackerItem[];

  abstract getReadableName(): string;
}
