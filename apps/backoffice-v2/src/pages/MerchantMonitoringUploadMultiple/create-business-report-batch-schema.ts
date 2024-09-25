import { z } from 'zod';

export const CreateBusinessReportBatchSchema = z.object({
  merchantSheet: z.union([z.any(), z.undefined()]),
});
