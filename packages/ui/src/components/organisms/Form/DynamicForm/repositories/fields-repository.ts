import {
  AUTOCOMPLETE_FIELD_ELEMENT_TYPE,
  DATE_FIELD_ELEMENT_TYPE,
  CHECKBOX_FIELD_ELEMENT_TYPE,
  CHECKBOXLIST_FIELD_ELEMENT_TYPE,
  TEXT_FIELD_ELEMENT_TYPE,
  MULTISELECT_FIELD_ELEMENT_TYPE,
  FIELD_LIST_ELEMENT_TYPE,
  ENTITY_FIELD_GROUP_ELEMENT_TYPE,
  SELECT_FIELD_ELEMENT_TYPE,
  SUBMIT_BUTTON_ELEMENT_TYPE,
  PHONE_FIELD_ELEMENT_TYPE,
  FILE_FIELD_ELEMENT_TYPE,
  RADIO_FIELD_ELEMENT_TYPE,
  TAGS_FIELD_ELEMENT_TYPE,
} from '@ballerine/common';
import { SubmitButton } from '../controls/SubmitButton';
import { AutocompleteField } from '../fields/AutocompleteField';
import { CheckboxField } from '../fields/CheckboxField';
import { CheckboxListField } from '../fields/CheckboxList';
import { DateField } from '../fields/DateField';
import { DOCUMENT_FIELD_TYPE, DocumentField } from '../fields/DocumentField';
import { EntityFieldGroup } from '../fields/EntityFieldGroup';
import { FieldList } from '../fields/FieldList';
import { FileField } from '../fields/FileField';
import { MultiselectField } from '../fields/MultiselectField';
import { PhoneField } from '../fields/PhoneField';
import { RadioField } from '../fields/RadioField';
import { SelectField } from '../fields/SelectField';
import { TagsField } from '../fields/TagsField';
import { TextField } from '../fields/TextField';
import { TDynamicFormField } from '../types';

export const baseFields = {
  [AUTOCOMPLETE_FIELD_ELEMENT_TYPE]: AutocompleteField,
  [CHECKBOX_FIELD_ELEMENT_TYPE]: CheckboxField,
  [CHECKBOXLIST_FIELD_ELEMENT_TYPE]: CheckboxListField,
  [DATE_FIELD_ELEMENT_TYPE]: DateField,
  [DOCUMENT_FIELD_TYPE]: DocumentField,
  [MULTISELECT_FIELD_ELEMENT_TYPE]: MultiselectField,
  [TEXT_FIELD_ELEMENT_TYPE]: TextField,
  [FIELD_LIST_ELEMENT_TYPE]: FieldList,
  [ENTITY_FIELD_GROUP_ELEMENT_TYPE]: EntityFieldGroup,
  [SELECT_FIELD_ELEMENT_TYPE]: SelectField,
  [SUBMIT_BUTTON_ELEMENT_TYPE]: SubmitButton,
  [PHONE_FIELD_ELEMENT_TYPE]: PhoneField,
  [FILE_FIELD_ELEMENT_TYPE]: FileField,
  [RADIO_FIELD_ELEMENT_TYPE]: RadioField,
  [TAGS_FIELD_ELEMENT_TYPE]: TagsField,
} as const;

export type TBaseFields = keyof typeof baseFields & string;

export let fieldsRepository = {
  ...baseFields,
};

export const getField = <T extends keyof typeof fieldsRepository>(fieldType: T) => {
  return fieldsRepository[fieldType];
};

export const extendFieldsRepository = <TNewFields extends string, TParams = unknown>(
  fields: Record<TNewFields, TDynamicFormField<TParams>>,
) => {
  const updatedRepository = { ...fieldsRepository, ...fields };
  fieldsRepository = updatedRepository;

  return updatedRepository;
};

export const getFieldsRepository = <
  TElements extends string = TBaseFields,
  TParams = unknown,
>() => {
  return fieldsRepository as Record<TElements, TDynamicFormField<TParams>>;
};
