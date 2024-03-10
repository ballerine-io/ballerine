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
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const AlertSeverities = [
  AlertSeverity.CRITICAL,
  AlertSeverity.HIGH,
  AlertSeverity.MEDIUM,
  AlertSeverity.LOW,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertSeverity>>;

export const AlertStatus = {
  NEW: 'new',
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export const AlertStatuses = [
  AlertStatus.NEW,
  AlertStatus.PENDING,
  AlertStatus.COMPLETED,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertStatus>>;

export const AlertType = {
  HIGH_RISK_TRANSACTION: 'high_risk_transaction',
  DORMANT_ACCOUNT_ACTIVITY: 'dormant_account_activity',
  UNUSUAL_PATTERN: 'unusual_pattern',
} as const;

export const AlertTypes = [
  AlertType.HIGH_RISK_TRANSACTION,
  AlertType.DORMANT_ACCOUNT_ACTIVITY,
  AlertType.UNUSUAL_PATTERN,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertType>>;

export const AlertState = {
  TRIGGERED: 'triggered',
  UNDER_REVIEW: 'under_review',
  ESCALATED: 'escalated',
  REJECTED: 'rejected',
  DISMISSED: 'dismissed',
  CLEARED: 'cleared',
} as const;

export const AlertStates = [
  AlertState.TRIGGERED,
  AlertState.UNDER_REVIEW,
  AlertState.ESCALATED,
  AlertState.REJECTED,
  AlertState.DISMISSED,
  AlertState.CLEARED,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertState>>;

export const alertStateToDecision = {
  REJECTED: 'reject',
  CLEARED: 'clear',
  REVERT_DECISION: 'revert decision',
} as const satisfies Partial<Record<keyof typeof AlertState | (string & {}), string>>;

export const alertDecisionToState = {
  REJECT: 'rejected',
  CLEAR: 'cleared',
  REVERT_DECISION: 'triggered',
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

export const AlertDefinitionByAlertIdSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const fetchAlertDefinitionByAlertId = async ({ alertId }: { alertId: string }) => {
  const [alertDefinition, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/${alertId}/alert-definition`,
    method: Method.GET,
    schema: AlertDefinitionByAlertIdSchema,
  });

  return handleZodError(error, alertDefinition);
};
