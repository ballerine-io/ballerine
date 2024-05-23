import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { AlertStatus, AlertStatuses, TAlert } from '@/domains/alerts/fetchers';
import { BooleanishSchema } from '@/lib/zod/utils/checkers';
import { z } from 'zod';

export const getAlertsSearchSchema = () =>
  BaseSearchSchema.extend({
    sortBy: z
      .enum(['dataTimestamp', 'status'] as const satisfies ReadonlyArray<
        Extract<keyof TAlert, 'dataTimestamp' | 'status'>
      >)
      .catch('dataTimestamp'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).catch([]),
        status: z.array(z.enum(AlertStatuses)).catch([AlertStatus.NEW]),
        state: z.array(z.string().nullable()).catch([]),
        correlationIds: z.array(z.string()).catch([]),
      })
      .catch({
        assigneeId: [],
        status: [AlertStatus.NEW],
        state: [],
        correlationIds: [],
      }),
    selected: BooleanishSchema.optional(),
    businessId: z.string().optional(),
    counterpartyId: z.string().optional(),
    type: z.string().optional(),
  });
