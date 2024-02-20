import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import { AlertStatuses, TAlertsList } from '@/domains/alerts/fetchers';
import { BooleanishSchema } from '@/lib/zod/utils/checkers';

export const getAlertsSearchSchema = (authenticatedUserId: string | null) =>
  BaseSearchSchema.extend({
    sortBy: z
      .enum(['dataTimestamp', 'status'] as const satisfies ReadonlyArray<
        Extract<keyof TAlertsList[number], 'dataTimestamp' | 'status'>
      >)
      .catch('dataTimestamp'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).catch([authenticatedUserId, null]),
        status: z.array(z.enum(AlertStatuses)).catch([]),
        state: z.array(z.string().nullable()).catch([]),
      })
      .catch({
        assigneeId: [authenticatedUserId, null],
        status: [],
        state: [],
      }),
    selected: BooleanishSchema.optional(),
  });
