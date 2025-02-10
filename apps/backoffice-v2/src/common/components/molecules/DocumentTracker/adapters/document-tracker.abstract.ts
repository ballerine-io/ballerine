import { TrackedDocument } from '@/domains/documents/hooks/fetchers';
import { TPlugin } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export interface DocumentTrackerItem {
  text: string | JSX.Element | undefined;
  leftIcon: JSX.Element | undefined;
}

export abstract class IDocumentTracker {
  abstract readonly PROCESS_NAME: string;

  constructor(public readonly documents: TrackedDocument, public readonly plugins?: TPlugin[]) {}

  abstract buildItems(): DocumentTrackerItem[];

  abstract getReadableName(): string;
}
