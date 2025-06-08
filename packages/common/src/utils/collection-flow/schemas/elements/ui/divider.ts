import { z } from 'zod';

export const DIVIDER_UI_ELEMENT_TYPE = 'divider' as const;

export const DividerElementType = z.literal(DIVIDER_UI_ELEMENT_TYPE);

export type TDividerElementType = z.infer<typeof DividerElementType>;
