import { z } from 'zod';
import { ParsedBooleanSchema } from '@ballerine/ui';

export const MerchantMonitoringCreateBusinessReportPageSearchSchema = z.object({
  changeChecksConfiguration: ParsedBooleanSchema.optional(),
  changeRiskAppetiteConfiguration: ParsedBooleanSchema.optional(),
});
