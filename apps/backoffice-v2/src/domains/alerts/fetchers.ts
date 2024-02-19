import qs from 'qs';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { z } from 'zod';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { TObjectValues } from '@/common/types';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { env } from '@/common/env/env';

export const AlertSeverity = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export const AlertSeverities = [
  AlertSeverity.CRITICAL,
  AlertSeverity.HIGH,
  AlertSeverity.MEDIUM,
  AlertSeverity.LOW,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertSeverity>>;

export const AlertStatus = {
  NEW: 'New',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
} as const;

export const AlertStatuses = [
  AlertStatus.NEW,
  AlertStatus.PENDING,
  AlertStatus.COMPLETED,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertStatus>>;

export const AlertType = {
  HIGH_RISK_TRANSACTION: 'HighRiskTransaction',
  DORMANT_ACCOUNT_ACTIVITY: 'DormantAccountActivity',
  UNUSUAL_PATTERN: 'UnusualPattern',
} as const;

export const AlertTypes = [
  AlertType.HIGH_RISK_TRANSACTION,
  AlertType.DORMANT_ACCOUNT_ACTIVITY,
  AlertType.UNUSUAL_PATTERN,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertType>>;

export const AlertState = {
  TRIGGERED: 'Triggered',
  UNDER_REVIEW: 'UnderReview',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
  ACKNOWLEDGED: 'Acknowledged',
  DISMISSED: 'Dismissed',
  REJECTED: 'Rejected',
  NOT_SUSPICIOUS: 'NotSuspicious',
} as const;

export const AlertStates = [
  AlertState.TRIGGERED,
  AlertState.UNDER_REVIEW,
  AlertState.ESCALATED,
  AlertState.RESOLVED,
  AlertState.ACKNOWLEDGED,
  AlertState.DISMISSED,
  AlertState.REJECTED,
  AlertState.NOT_SUSPICIOUS,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertState>>;

export const alertStateToDecision = {
  REJECTED: 'Reject',
  NOT_SUSPICIOUS: 'Not Suspicious',
  REVERT_DECISION: 'Revert Decision',
} as const satisfies Partial<Record<keyof typeof AlertState | (string & {}), string>>;

export const alertDecisionToState = {
  REJECT: 'Rejected',
  NOT_SUSPICIOUS: 'NotSuspicious',
  REVERT_DECISION: 'Triggered',
} as const satisfies Partial<Record<keyof typeof AlertState | (string & {}), string>>;

export type TAlertSeverity = (typeof AlertSeverities)[number];

export type TAlertSeverities = typeof AlertSeverities;

export type TAlertType = (typeof AlertTypes)[number];

export type TAlertTypes = typeof AlertTypes;

export type TAlertState = (typeof AlertStates)[number];

export type TAlertStates = typeof AlertStates;

export const AlertsListSchema = z.array(
  ObjectWithIdSchema.extend({
    dataTimestamp: z.string().datetime(),
    merchant: ObjectWithIdSchema.extend({
      name: z.string(),
    }).nullable(),
    severity: z.enum(AlertSeverities),
    alertDetails: z.string(),
    // amountOfTxs: z.number(),
    assignee: ObjectWithIdSchema.extend({
      fullName: z.string(),
    })
      .nullable()
      .default(null),
    status: z.enum(AlertStatuses),
    decision: z.enum(AlertStates).nullable().default(null),
    counterpartyId: z.string().nullable().default(null),
  }),
);

export type TAlertsList = z.output<typeof AlertsListSchema>;

export const fetchAlerts = async (params: {
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
}) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts?${queryParams}`,
    method: Method.GET,
    schema: AlertsListSchema,
  });

  return handleZodError(error, alerts);
};

export const assignAlertsByIds = async ({
  assigneeId,
  alertIds,
}: {
  assigneeId: string | null;
  alertIds: string[];
}) => {
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/assign`,
    method: Method.PATCH,
    body: {
      assigneeId,
      alertIds,
    },
    schema: z.any(),
  });

  return handleZodError(error, alerts);
};

export const updateAlertsDecisionByIds = async ({
  decision,
  alertIds,
}: {
  decision: TAlertState;
  alertIds: string[];
}) => {
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/decision`,
    method: Method.PATCH,
    body: {
      decision,
      alertIds,
    },
    schema: z.any(),
  });

  return handleZodError(error, alerts);
};
