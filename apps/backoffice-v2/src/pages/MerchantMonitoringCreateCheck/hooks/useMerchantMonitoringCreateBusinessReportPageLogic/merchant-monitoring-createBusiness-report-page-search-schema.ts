import { z } from 'zod';
import { ParsedBooleanSchema } from '@/lib/zod/utils/checkers';

export const MerchantMonitoringCreateBusinessReportPageSearchSchema = z.object({
  changeChecksConfiguration: ParsedBooleanSchema.optional(),
  changeRiskAppetiteConfiguration: ParsedBooleanSchema.optional(),
});
