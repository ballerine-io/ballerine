import { z } from 'zod';

export const ColumnElementParamsSchema = z.object({
  className: z.string().optional(),
});

export const COLUMN_UI_ELEMENT_TYPE = 'column' as const;

export const ColumnElementType = z.literal(COLUMN_UI_ELEMENT_TYPE);

export type TColumnElementType = typeof COLUMN_UI_ELEMENT_TYPE;

export type TColumnElementParams = z.infer<typeof ColumnElementParamsSchema>;
