import { z } from 'zod';
import { FieldListParamsSchema } from './fieldlist';
import { CommonHttpParamsSchema } from '../common/http-params';

export const ENTITY_FIELD_GROUP_ELEMENT_TYPE = 'entityfieldgroup' as const;
export const EntityFieldGroupElementType = z.literal(ENTITY_FIELD_GROUP_ELEMENT_TYPE);

export type TEntityFieldGroupElementType = z.infer<typeof EntityFieldGroupElementType>;

export const EntityFieldGroupHttpParamsSchema = z.object({});

export const EntityFieldGroupParamsSchema = FieldListParamsSchema.extend({
  type: z.union([z.literal('ubo'), z.literal('director')]),
  createEntityText: z.string().optional(),
  httpParams: z.object({
    createEntity: z.object({
      httpParams: CommonHttpParamsSchema,
      transform: z.string().optional(),
    }),
    updateEntity: z.object({
      httpParams: CommonHttpParamsSchema,
      transform: z.string().optional(),
    }),
    deleteEntity: CommonHttpParamsSchema,
    uploadDocument: CommonHttpParamsSchema.optional(),
    deleteDocument: CommonHttpParamsSchema.optional(),
  }),
});

export type TEntityFieldGroupParams = z.infer<typeof EntityFieldGroupParamsSchema>;
