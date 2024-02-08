import qs from 'qs';
import { apiClient } from '@/common/api-client/api-client';
import { Method } from '@/common/enums';
import { z } from 'zod';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { TObjectValues } from '@/common/types';

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
  PENDING: 'pending',
  RESOLVED: 'resolved',
} as const;

export const AlertStatuses = [
  AlertStatus.PENDING,
  AlertStatus.RESOLVED,
] as const satisfies ReadonlyArray<TObjectValues<typeof AlertStatus>>;

export const AlertsListSchema = z.array(
  ObjectWithIdSchema.extend({
    createdAt: z.string().datetime(),
    merchant: z.string(),
    severity: z.enum(AlertSeverities),
    alertDetails: z.string(),
    amountOfTxs: z.number(),
    assignee: z.string(),
    status: z.enum(AlertStatuses),
    decision: z.string(),
  }).transform(({ createdAt, ...data }) => ({
    ...data,
    date: createdAt,
  })),
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
    endpoint: `alerts?${queryParams}`,
    method: Method.GET,
    schema: z.object({
      data: AlertsListSchema,
      meta: z.object({
        totalItems: z.number().nonnegative(),
        totalPages: z.number().nonnegative(),
      }),
    }),
  });

  return handleZodError(error, alerts);
};
