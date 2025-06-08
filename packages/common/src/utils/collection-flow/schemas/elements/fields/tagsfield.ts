import { z } from 'zod';
import { FieldSchema } from '../common/field';

export const TAGS_FIELD_ELEMENT_TYPE = 'tagsfield' as const;
export const TagsFieldElementType = z.literal(TAGS_FIELD_ELEMENT_TYPE);

export const TagsFieldParamsSchema = FieldSchema;

export type TTagsFieldParams = z.infer<typeof TagsFieldParamsSchema>;
