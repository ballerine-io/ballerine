import { WorkflowRuntimeData } from '@prisma/client';
import { TEventName } from '@/workflow/types';

export interface ListenerFn {
  (...values: any[]): void;
}

export interface IWebhookPayload {
  id: string;
  eventName: TEventName;
  apiVersion: string;
  // ISO string
  timestamp: string;
  workflowCreatedAt: WorkflowRuntimeData['createdAt'];
  workflowResolvedAt: WorkflowRuntimeData['resolvedAt'];
  workflowDefinitionId: string;
  workflowRuntimeId: string;
  workflowStatus: string;
  workflowFinalState: string;
  ballerineEntityId: string;
  correlationId: string;
  environment: string | undefined;
  data: unknown;
}
