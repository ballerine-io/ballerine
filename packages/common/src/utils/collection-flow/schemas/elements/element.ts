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
  TaxIdPickerFieldElementType,
  TaxIdPickerFieldParamsSchema,
  TextFieldElementType,
  TextFieldParamsSchema,
} from './fields';
import { ValidatorSchema } from '../validation/validator';
import { CollectionFlowRuleSchema } from './common/rule';
import { FieldSchema } from './common';

export let InitialUIElement = z.object({
  id: z.string(),
  valueDestination: z.string().optional(),
  defaultValue: z.any().optional(),
  params: FieldSchema.optional(),
  validate: z.array(ValidatorSchema).optional(),
  hidden: z.array(CollectionFlowRuleSchema).optional(),
  disable: z.array(CollectionFlowRuleSchema).optional(),
});

export let UIElementsSchema = z.discriminatedUnion('element', [
  // UI Elements start
  InitialUIElement.extend({
    element: ColumnElementType,
    params: ColumnElementParamsSchema.optional(),
  }),
  InitialUIElement.extend({
    element: RowElementType,
    params: RowElementParamsSchema.optional(),
  }),
  InitialUIElement.extend({
    element: DescriptionElementType,
    params: DescriptionElementParamsSchema,
  }),
  InitialUIElement.extend({
    element: H1ElementType,
    params: H1ElementParamsSchema,
  }),
  InitialUIElement.extend({
    element: H3ElementType,
    params: H3ElementParamsSchema,
  }),
  InitialUIElement.extend({
    element: H4ElementType,
    params: H4ElementParamsSchema,
  }),
  InitialUIElement.extend({
    element: DividerElementType,
  }),

  // UI Elements end

  // Fields start
  InitialUIElement.extend({
    element: AutocompleteFieldElementType,
    params: AutocompleteFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: CheckboxFieldElementType,
    params: CheckboxFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: CheckboxListElementType,
    params: CheckboxListParamsSchema,
  }),
  InitialUIElement.extend({
    element: DateFieldElementType,
    params: DateFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: DocumentFieldElementType,
    params: DocumentFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: FieldListElementType,
    params: FieldListParamsSchema,
  }),
  InitialUIElement.extend({
    element: EntityFieldGroupElementType,
    params: EntityFieldGroupParamsSchema,
  }),
  InitialUIElement.extend({
    element: FileFieldElementType,
    params: FileFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: MultiSelectFieldElementType,
    params: MultiSelectFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: PhoneFieldElementType,
    params: PhoneFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: RadioFieldElementType,
    params: RadioFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: SelectFieldElementType,
    params: SelectFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: TagsFieldElementType,
    params: TagsFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: TextFieldElementType,
    params: TextFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: IndustriesPickerFieldElementType,
    params: IndustriesPickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: CountryPickerFieldElementType,
    params: CountryPickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: LocalePickerFieldElementType,
    params: LocalePickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: MCCPickerFieldElementType,
    params: MCCPickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: NationalityPickerFieldElementType,
    params: NationalityPickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: StatePickerFieldElementType,
    params: StatePickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: TaxIdPickerFieldElementType,
    params: TaxIdPickerFieldParamsSchema,
  }),
  InitialUIElement.extend({
    element: SubmitButtonElementType,
    params: SubmitParamsSchema,
  }),
]);

export const UIElementsSchemaWithChildren: z.ZodType<any> = z.intersection(
  UIElementsSchema,
  z.object({
    children: z.lazy(() => z.array(UIElementsSchemaWithChildren)).optional(),
  }),
);

export type TUIElements = z.infer<typeof UIElementsSchema>['element'];

export type TUIElement = z.infer<typeof UIElementsSchema> & {
  children?: TUIElement[];
};

export type GetElementByType<T, K extends string> = T extends { element: K } ? T : never;

export type GetUIElementByType<T extends string> = GetElementByType<TUIElement, T>;
