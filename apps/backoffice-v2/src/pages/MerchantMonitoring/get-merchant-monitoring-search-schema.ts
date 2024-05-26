import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import { BooleanishSchema } from '@/lib/zod/utils/checkers';
import { TBusinessReport } from '@/domains/business-reports/fetchers';

export const getMerchantMonitoringSearchSchema = (authenticatedUserId: string | undefined) =>
  BaseSearchSchema.extend({
    sortBy: z
      .enum([
        'createdAt',
        'updatedAt',
        'business.website',
        'business.companyName',
        'business.country',
        'riskScore',
        'status',
      ] as const satisfies ReadonlyArray<
        | Extract<
            keyof NonNullable<TBusinessReport>,
            'createdAt' | 'updatedAt' | 'riskScore' | 'status'
          >
        | 'business.website'
        | 'business.companyName'
        | 'business.country'
      >)
      .catch('createdAt'),
    selected: BooleanishSchema.optional(),
  });
