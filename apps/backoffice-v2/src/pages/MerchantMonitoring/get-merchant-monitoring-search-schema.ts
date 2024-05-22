import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import { BooleanishSchema } from '@/lib/zod/utils/checkers';
import { TBusinessReport } from '@/domains/business-reports/fetchers';

export const getMerchantMonitoringSearchSchema = (authenticatedUserId: string | undefined) =>
  BaseSearchSchema.extend({
    sortBy: z
      .enum(['createdAt', 'updatedAt'] as const satisfies ReadonlyArray<
        Extract<keyof NonNullable<TBusinessReport>, 'createdAt' | 'updatedAt'>
      >)
      .catch('createdAt'),
    selected: BooleanishSchema.optional(),
  });
