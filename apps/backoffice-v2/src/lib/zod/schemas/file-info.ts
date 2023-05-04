import { z } from 'zod';
import { ObjectWithIdSchema } from '../utils/object-with-id';
export const FileInfoSchema = ObjectWithIdSchema.extend({
  userId: z.string().nullable().default(''),
  fileNameOnDisk: z.string().default(''),
  uri: z.string().nullable().default(''),
  bucketKey: z.string().default(''),
});
