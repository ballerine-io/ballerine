import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { env } from '@/common/env/env';
import { TObjectValues } from '@/common/types';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import qs from 'qs';
import { z } from 'zod';

export const BusinessAlertSeverity = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const BusinessAlertSeverities = [
  BusinessAlertSeverity.CRITICAL,
  BusinessAlertSeverity.HIGH,
  BusinessAlertSeverity.MEDIUM,
  BusinessAlertSeverity.LOW,
] as const satisfies ReadonlyArray<TObjectValues<typeof BusinessAlertSeverity>>;

export const BusinessAlertStatus = {
  NEW: 'new',
  PENDING: 'pending',
  COMPLETED: 'completed',
} as const;

export const BusinessAlertStatuses = [
  BusinessAlertStatus.NEW,
  BusinessAlertStatus.PENDING,
  BusinessAlertStatus.COMPLETED,
] as const satisfies ReadonlyArray<TObjectValues<typeof BusinessAlertStatus>>;

export const BusinessAlertState = {
  TRIGGERED: 'triggered',
  UNDER_REVIEW: 'under_review',
  ESCALATED: 'escalated',
  REJECTED: 'rejected',
  DISMISSED: 'dismissed',
  CLEARED: 'cleared',
} as const;

export const BusinessAlertStates = [
  BusinessAlertState.TRIGGERED,
  BusinessAlertState.UNDER_REVIEW,
  BusinessAlertState.ESCALATED,
  BusinessAlertState.REJECTED,
  BusinessAlertState.DISMISSED,
  BusinessAlertState.CLEARED,
] as const satisfies ReadonlyArray<TObjectValues<typeof BusinessAlertState>>;

export const businessAlertStateToDecision = {
  REJECTED: 'reject',
  CLEARED: 'clear',
  REVERT_DECISION: 'revert decision',
} as const satisfies Partial<Record<keyof typeof BusinessAlertState | (string & {}), string>>;

export const businessAlertDecisionToState = {
  REJECT: 'rejected',
  CLEAR: 'cleared',
  REVERT_DECISION: 'triggered',
} as const satisfies Partial<Record<keyof typeof BusinessAlertState | (string & {}), string>>;

export type TBusinessAlertSeverity = (typeof BusinessAlertSeverities)[number];

export type TBusinessAlertSeverities = typeof BusinessAlertSeverities;

export type TBusinessAlertState = (typeof BusinessAlertStates)[number];

export type TBusinessAlertStates = typeof BusinessAlertStates;

export const BusinessAlertsListSchema = z.array(
  ObjectWithIdSchema.extend({
    dataTimestamp: z.string().datetime(),
    updatedAt: z.string().datetime(),
    subject: ObjectWithIdSchema.extend({
      companyName: z.string(),
      businessReports: z.any(),
    }),
    severity: z.enum(BusinessAlertSeverities),
    label: z.string(),
    alertDetails: z.string(),
    // amountOfTxs: z.number(),
    assignee: ObjectWithIdSchema.extend({
      fullName: z.string(),
      avatarUrl: z.string().nullable().optional(),
    })
      .nullable()
      .default(null),
    status: z.enum(BusinessAlertStatuses),
    decision: z.enum(BusinessAlertStates).nullable().default(null),
    counterpartyId: z.string().nullable().default(null),
  }),
);

export type TBusinessAlertsList = z.output<typeof BusinessAlertsListSchema>;
export type AlertEntityType = 'transaction' | 'business';

export const fetchBusinessAlerts = async (params: {
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
  entityType: AlertEntityType;
}) => {
  const queryParams = qs.stringify(params, { encode: false });
  const [alerts, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/external/alerts/business-report?${queryParams}`,
    method: Method.GET,
    schema: BusinessAlertsListSchema,
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
  decision: TBusinessAlertState;
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

export const AlertLabelsSchema = z.array(z.string());

export const fetchAlertLabels = async () => {
  const [alertDefinition, error] = await apiClient({
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/internal/alerts/labels`,
    method: Method.GET,
    schema: AlertLabelsSchema,
  });

  return handleZodError(error, alertDefinition);
};
