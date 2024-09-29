import { RawAxiosRequestHeaders } from 'axios';

export type BaseOutgoingWebhookPayload = {
  id: string;
  apiVersion: string;
  timestamp: string;
  workflowCreatedAt: Date;
  workflowResolvedAt: Date | null;
  workflowDefinitionId: string;
  workflowRuntimeId: string;
  ballerineEntityId: string;
  correlationId: string;
  environment: string | undefined;
  data: Record<string, any>;
};

export type OutgoingWebhookPayloads = {
  'workflow.completed': BaseOutgoingWebhookPayload & {
    eventName: 'workflow.completed';
  };
  'workflow.state.changed': BaseOutgoingWebhookPayload & {
    eventName: 'workflow.state.changed';
    state: string | null;
  };
  'workflow.context.document.changed': BaseOutgoingWebhookPayload & {
    eventName: 'workflow.context.document.changed';
    assignee: { id: string; firstName: string; lastName: string; email: string } | null;
    assignedAt: Date | null;
  };
};

export type OutgoingWebhookJobData = {
  url: string;
  method: string;
  headers?: RawAxiosRequestHeaders;
  data: OutgoingWebhookPayloads[keyof OutgoingWebhookPayloads];
  timeout?: number;
  secret?: string;
};
