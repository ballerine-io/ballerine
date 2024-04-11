import { z } from 'zod';

export const BusinessReportSchema = z.object({
  reportFileId: z.string(),
});
export const BusinessReportsSchema = z.array(BusinessReportSchema);
