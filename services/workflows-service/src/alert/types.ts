import { TIME_UNITS } from '@/data-analytics/consts';
import { Alert, AlertDefinition, Business, EndUser, Prisma, User } from '@prisma/client';

// TODO: Remove counterpartyId from SubjectRecord
export type Subject = 'counterpartyOriginatorId' | 'counterpartyBeneficiaryId' | 'counterpartyId';

export type SubjectRecord = {
  [key in Subject]?: string;
} & ({ counterpartyOriginatorId: string } | { counterpartyBeneficiaryId: string });

export type TExecutionDetails = {
  checkpoint: {
    hash: string;
  };
  subject: SubjectRecord;
  filters: Prisma.TransactionRecordWhereInput;
  executionRow: unknown;
};

export type TDedupeStrategy = {
  mute: boolean;
  cooldownTimeframeInMinutes: number;
  dedupeWindow: DedupeWindow;
};

export type DedupeWindow = {
  timeAmount: number;
  timeUnit: (typeof TIME_UNITS)[keyof typeof TIME_UNITS];
};

export const BulkStatus = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type TBulkStatus = (typeof BulkStatus)[keyof typeof BulkStatus];

export type TAlertResponse = Alert & {
  alertDefinition: Pick<AlertDefinition, 'description' | 'correlationId'>;
  assignee: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
};

export type TAlertTransactionResponse = TAlertResponse & {
  counterparty: {
    business: Pick<Business, 'id' | 'companyName' | 'correlationId'>;
    endUser: Pick<EndUser, 'id' | 'firstName' | 'lastName' | 'correlationId'>;
  };
  counterpartyBeneficiary: {
    business: Pick<Business, 'id' | 'companyName' | 'correlationId'>;
    endUser: Pick<EndUser, 'id' | 'firstName' | 'lastName' | 'correlationId'>;
  };
  counterpartyOriginator: {
    business: Pick<Business, 'id' | 'companyName' | 'correlationId'>;
    endUser: Pick<EndUser, 'id' | 'firstName' | 'lastName' | 'correlationId'>;
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
