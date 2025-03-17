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
  autocompletefield: AutocompleteField,
  checkboxfield: CheckboxField,
  checkboxlistfield: CheckboxListField,
  datefield: DateField,
  [DOCUMENT_FIELD_TYPE]: DocumentField,
  multiselectfield: MultiselectField,
  textfield: TextField,
  fieldlist: FieldList,
  entityfieldgroup: EntityFieldGroup,
  selectfield: SelectField,
  submitbutton: SubmitButton,
  phonefield: PhoneField,
  filefield: FileField,
  radiofield: RadioField,
  tagsfield: TagsField,
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
