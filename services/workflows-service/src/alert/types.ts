import { Alert, AlertDefinition, Business, EndUser, User } from '@prisma/client';

export type TExecutionDetails = {
  checkpoint: {
    hash: string;
  };
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
  alertDefinition: Pick<AlertDefinition, 'description' | 'correlationId'>;
  assignee: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
  counterparty: {
    business: Pick<Business, 'id' | 'companyName' | 'correlationId'>;
    endUser: Pick<EndUser, 'id' | 'firstName' | 'lastName' | 'correlationId'>;
  };
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
