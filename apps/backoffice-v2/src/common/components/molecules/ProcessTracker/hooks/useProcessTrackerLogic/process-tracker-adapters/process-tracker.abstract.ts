import { TPlugin } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ReactNode } from 'react';

export interface IProcessTrackerItem {
  text: string | ReactNode | undefined;
  leftIcon: ReactNode | undefined;
}

export abstract class IProcessTracker {
  abstract readonly PROCESS_NAME: string;

  constructor(readonly workflow: TWorkflowById, readonly plugins?: TPlugin[]) {}

  abstract buildItems(): IProcessTrackerItem[];

  abstract getReadableName(): string;
}
