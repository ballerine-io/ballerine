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
  SubmitButtonElementType,
  SubmitParamsSchema,
} from './ui';
import { AutocompleteFieldElementType, AutocompleteFieldParamsSchema } from './fields/autocomplete';
import { CheckboxFieldElementType, CheckboxFieldParamsSchema } from './fields/checkbox';
import {
  CheckboxListElementType,
  CheckboxListParamsSchema,
  CountryPickerFieldElementType,
  CountryPickerFieldParamsSchema,
  DateFieldElementType,
  DateFieldParamsSchema,
  DocumentFieldElementType,
  DocumentFieldParamsSchema,
  EntityFieldGroupElementType,
  EntityFieldGroupParamsSchema,
  FieldListElementType,
  FieldListParamsSchema,
  FileFieldElementType,
  FileFieldParamsSchema,
  IndustriesPickerFieldElementType,
  IndustriesPickerFieldParamsSchema,
  LocalePickerFieldElementType,
  LocalePickerFieldParamsSchema,
  MCCPickerFieldElementType,
  MCCPickerFieldParamsSchema,
  MultiSelectFieldElementType,
  MultiSelectFieldParamsSchema,
  NationalityPickerFieldElementType,
  NationalityPickerFieldParamsSchema,
  PhoneFieldElementType,
  PhoneFieldParamsSchema,
  RadioFieldElementType,
  RadioFieldParamsSchema,
  SelectFieldElementType,
  SelectFieldParamsSchema,
  StatePickerFieldElementType,
  StatePickerFieldParamsSchema,
  TagsFieldElementType,
  TagsFieldParamsSchema,
  TextFieldElementType,
  TextFieldParamsSchema,
} from './fields';
import { ValidatorSchema } from '../validation/validator';
import { CollectionFlowRuleSchema } from './common/rule';
import { FieldSchema } from './common';

export const BaseUIElement = z.object({
  id: z.string(),
  valueDestination: z.string().optional(),
  defaultValue: z.any().optional(),
  params: FieldSchema.optional(),
  validate: z.array(ValidatorSchema).optional(),
  hidden: z.array(CollectionFlowRuleSchema).optional(),
  disable: z.array(CollectionFlowRuleSchema).optional(),
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
  BaseUIElement.extend({
    element: CheckboxListElementType,
    params: CheckboxListParamsSchema,
  }),
  BaseUIElement.extend({
    element: DateFieldElementType,
    params: DateFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: DocumentFieldElementType,
    params: DocumentFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: FieldListElementType,
    params: FieldListParamsSchema,
  }),
  BaseUIElement.extend({
    element: EntityFieldGroupElementType,
    params: EntityFieldGroupParamsSchema,
  }),
  BaseUIElement.extend({
    element: FileFieldElementType,
    params: FileFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: MultiSelectFieldElementType,
    params: MultiSelectFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: PhoneFieldElementType,
    params: PhoneFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: RadioFieldElementType,
    params: RadioFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: SelectFieldElementType,
    params: SelectFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: TagsFieldElementType,
    params: TagsFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: TextFieldElementType,
    params: TextFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: IndustriesPickerFieldElementType,
    params: IndustriesPickerFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: CountryPickerFieldElementType,
    params: CountryPickerFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: LocalePickerFieldElementType,
    params: LocalePickerFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: MCCPickerFieldElementType,
    params: MCCPickerFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: NationalityPickerFieldElementType,
    params: NationalityPickerFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: StatePickerFieldElementType,
    params: StatePickerFieldParamsSchema,
  }),
  BaseUIElement.extend({
    element: SubmitButtonElementType,
    params: SubmitParamsSchema,
  }),
]);

export type TUIElements = z.infer<typeof BaseUIElementSchema>['element'];

export type TUIElement = z.infer<typeof BaseUIElementSchema> & {
  children?: TUIElement[];
};

export type GetElementByType<T, K extends string> = T extends { element: K } ? T : never;

export type GetUIElementByType<T extends string> = GetElementByType<TUIElement, T>;
