import { z } from 'zod';

export const RowElementParamsSchema = z.object({
  className: z.string().optional(),
});

export const ROW_UI_ELEMENT_TYPE = 'row' as const;

export const RowElementType = z.literal(ROW_UI_ELEMENT_TYPE);

export type TRowElementType = z.infer<typeof RowElementType>;

export type TRowElementParams = z.infer<typeof RowElementParamsSchema>;
