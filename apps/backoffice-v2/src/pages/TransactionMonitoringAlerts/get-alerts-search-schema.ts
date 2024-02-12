import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import { AlertStatus, AlertStatuses, TAlertsList } from '@/domains/alerts/fetchers';

export const getAlertsSearchSchema = (authenticatedUserId: string | null) =>
  BaseSearchSchema.extend({
    sortBy: z
      .enum(['dataTimestamp', 'status'] as const satisfies Pick<
        ReadonlyArray<keyof TAlertsList[number]>,
        'dataTimestamp' | 'status'
      >)
      .catch('dataTimestamp'),
    filter: z
      .object({
        assigneeId: z.array(z.string().nullable()).catch([authenticatedUserId, null]),
        status: z.array(z.enum(AlertStatuses)).catch([AlertStatus.NEW]),
        state: z.array(z.string().nullable()).catch([]),
      })
      .catch({
        // assigneeId: [authenticatedUserId, null],
        // status: [AlertStatus.NEW],
        // state: [],
      }),
  });
