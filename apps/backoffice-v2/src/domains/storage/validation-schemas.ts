import { ObjectWithIdSchema } from '../../lib/zod/utils/object-with-id/object-with-id';
import { z } from 'zod';

export const FileInfoSchema = ObjectWithIdSchema.extend({
  userId: z.string().nullable().default(''),
  fileNameOnDisk: z.string().default(''),
  uri: z.string().nullable().default(''),
  fileNameInBucket: z.string().nullable().default(''),
});
