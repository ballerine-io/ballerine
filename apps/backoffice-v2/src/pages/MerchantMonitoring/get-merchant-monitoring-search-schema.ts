import { BaseSearchSchema } from '@/common/hooks/useSearchParamsByEntity/validation-schemas';
import { z } from 'zod';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { BooleanishSchema } from '@ballerine/ui';

export const getMerchantMonitoringSearchSchema = () =>
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
