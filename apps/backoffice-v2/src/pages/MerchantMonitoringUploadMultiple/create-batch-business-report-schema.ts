import { z } from 'zod';

export const CreateBatchBusinessReportSchema = z.object({
  merchantSheet: z.union([z.any(), z.undefined()]),
});
