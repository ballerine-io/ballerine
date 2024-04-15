import { Alert, AlertDefinition, Business, User } from '@prisma/client';

export type TExecutionDetails = {
  checkpoint: {
    hash: string;
  };
  subject: Array<Record<string, unknown>>;
  executionRow: unknown;
};

export type TDedupeStrategy = {
  mute: boolean;
  cooldownTimeframeInMinutes: number;
};

export const BulkStatus = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type TBulkStatus = (typeof BulkStatus)[keyof typeof BulkStatus];

export type TAlertResponse = Alert & {
  alertDefinition: Pick<AlertDefinition, 'description' | 'label'>;
  assignee: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
};

export type TAlertTransactionResponse = TAlertResponse & {
  counterparty: {
    business: Pick<Business, 'id' | 'companyName'>;
    endUser: Pick<User, 'id' | 'firstName' | 'lastName'>;
  };
};

export type TAlertMerchantResponse = TAlertResponse & {
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
