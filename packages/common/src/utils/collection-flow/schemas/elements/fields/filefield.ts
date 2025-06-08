import { z } from 'zod';
import { FieldSchema } from '../common/field';
import { CommonHttpParamsSchema } from '../common/http-params';

export const FILE_FIELD_ELEMENT_TYPE = 'filefield' as const;
export const FileFieldElementType = z.literal(FILE_FIELD_ELEMENT_TYPE);

export const FileFieldParamsSchema = FieldSchema.extend({
  uploadOn: z.union([z.literal('change'), z.literal('submit')]).optional(),
  acceptFileFormats: z.string().optional(),
  httpParams: z.object({
    createDocument: CommonHttpParamsSchema,
    deleteDocument: CommonHttpParamsSchema,
  }),
});

export type TFileFieldParams = z.infer<typeof FileFieldParamsSchema>;
