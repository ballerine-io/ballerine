import { Alert, AlertDefinition, Business, User } from '@prisma/client';

export type TExecutionDetails = {
  checkpoint: {
    hash: string;
  };
  executionRow: any;
};

export type TDedupeStrategy = {
  mute: boolean;
  cooldownTimeframeInMinutes: number;
};

export type TAuthenticationConfiguration = {
  apiType: 'API_KEY' | 'OAUTH2' | 'BASIC_AUTH';
  authValue: string;
  validUntil?: string;
  isValid: boolean;
  webhookSharedSecret: string;
};

export const BulkStatus = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type TBulkStatus = (typeof BulkStatus)[keyof typeof BulkStatus];

export type TAlertResponse = Alert & {
  alertDefinition: Pick<AlertDefinition, 'description' | 'label'>;
  assignee: Pick<User, 'id' | 'firstName' | 'lastName'>;
  business: Pick<Business, 'id' | 'companyName'>;
};

export type TAlertUpdateResponse = Array<{
  alertId: string;
  status: string;
}>;

type SuccessResponse = {
  alertId: string;
  status: 'success';
};

type FailedResponse = {
  alertId: string;
  status: 'failed';
  errors: Array<{
    path?: string;
    message: string;
  }>;
};
export type TBulkAssignAlertsResponse = Array<SuccessResponse | FailedResponse>;
