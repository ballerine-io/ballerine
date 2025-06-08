import { z } from 'zod';
import {
  ColumnElementType,
  DescriptionElementType,
  H1ElementType,
  H3ElementType,
  H4ElementType,
  RowElementType,
  DividerElementType,
  ColumnElementParamsSchema,
  DescriptionElementParamsSchema,
  H1ElementParamsSchema,
  H3ElementParamsSchema,
  H4ElementParamsSchema,
  RowElementParamsSchema,
} from './ui';

export const ElementsSchema = z.union([
  ColumnElementType,
  DescriptionElementType,
  H1ElementType,
  H3ElementType,
  H4ElementType,
  RowElementType,
  DividerElementType,
]);

export const UIElementParams = z.union([
  ColumnElementParamsSchema,
  DescriptionElementParamsSchema,
  H1ElementParamsSchema,
  H3ElementParamsSchema,
  H4ElementParamsSchema,
  RowElementParamsSchema,
]);

export const BaseUIElement = z.object({
  id: z.string(),
  valueDestination: z.string().optional(),
  params: UIElementParams,
  defaultValue: z.any().optional(),
  validate: z.any(),
  hidden: z.any(),
});

export const BaseUIElementSchema = z.discriminatedUnion('element', [
  BaseUIElement.extend({
    element: ColumnElementType,
    params: ColumnElementParamsSchema,
  }),
  BaseUIElement.extend({
    element: RowElementType,
    params: RowElementParamsSchema,
  }),
  BaseUIElement.extend({
    element: DescriptionElementType,
    params: DescriptionElementParamsSchema,
  }),
  BaseUIElement.extend({
    element: H1ElementType,
    params: H1ElementParamsSchema,
  }),
  BaseUIElement.extend({
    element: H3ElementType,
    params: H3ElementParamsSchema,
  }),
  BaseUIElement.extend({
    element: H4ElementType,
    params: H4ElementParamsSchema,
  }),
  BaseUIElement.extend({
    element: DividerElementType,
  }),
]);

export type TUIElement = z.infer<typeof BaseUIElementSchema> & { children?: TUIElement[] };

const test: TUIElement = {
  id: '1',
  valueDestination: 'test',
  element: 'h3',
  params: {
    text: 'test',
  },
  defaultValue: 'test',
  validate: 'test',
  hidden: false,
  children: [
    {
      id: '2',
      element: 'column',
      params: {
        className: 'test',
      },
    },
  ],
};
