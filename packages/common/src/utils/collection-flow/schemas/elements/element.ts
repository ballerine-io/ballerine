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
import { AutocompleteFieldElementType, AutocompleteFieldParamsSchema } from './fields/autocomplete';
import { CheckboxFieldElementType, CheckboxFieldParamsSchema } from './fields/checkbox';

export const FieldsSchema = z.union([AutocompleteFieldElementType, CheckboxFieldElementType]);

export const FieldsParamsSchema = z.union([
  AutocompleteFieldParamsSchema,
  CheckboxFieldParamsSchema,
]);

export const UIElementsSchema = z.union([
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
  params: z.union([...UIElementParams.options, ...FieldsParamsSchema.options]),
  defaultValue: z.any().optional(),
  validate: z.any(),
  hidden: z.any(),
});

export const BaseUIElementSchema = z.discriminatedUnion('element', [
  // UI Elements start
  BaseUIElement.extend({
    element: ColumnElementType,
    params: ColumnElementParamsSchema,
    children: z.array(BaseUIElement),
  }),
  BaseUIElement.extend({
    element: RowElementType,
    params: RowElementParamsSchema,
    children: z.array(BaseUIElement),
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

  // UI Elements end

  // Fields start
  BaseUIElement.extend({
    element: AutocompleteFieldElementType,
    params: AutocompleteFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: CheckboxFieldElementType,
    params: CheckboxFieldParamsSchema,
  }),
]);

export type TUIElement = z.infer<typeof BaseUIElementSchema> & {
  children?: TUIElement[];
};

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
      element: 'row',
      params: {
        className: 'test',
      },
      children: [
        {
          id: '3',
          element: 'description',
          params: {
            descriptionRaw: 'test',
          },
        },
      ],
    },
    {
      id: '3',
      element: 'autocompletefield',
      params: {
        options: [
          {
            label: 'test',
            value: 'test',
          },
        ],
        label: 'test',
        placeholder: 'test',
      },
      children: [],
    },
  ],
};
