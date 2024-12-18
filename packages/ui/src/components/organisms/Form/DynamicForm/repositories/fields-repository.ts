import { SubmitButton } from '../controls/SubmitButton';
import { AutocompleteField } from '../fields/AutocompleteField';
import { CheckboxField } from '../fields/CheckboxField';
import { CheckboxListField } from '../fields/CheckboxList';
import { DateField } from '../fields/DateField';
import { FieldList } from '../fields/FieldList';
import { MultiselectField } from '../fields/MultiselectField';
import { PhoneField } from '../fields/PhoneField';
import { SelectField } from '../fields/SelectField';
import { TextField } from '../fields/TextField';
import { TDynamicFormField } from '../types';

export const baseFields = {
  autocompletefield: AutocompleteField,
  checkboxfield: CheckboxField,
  checkboxlistfield: CheckboxListField,
  datefield: DateField,
  multiselectfield: MultiselectField,
  textfield: TextField,
  fieldlist: FieldList,
  selectfield: SelectField,
  submitbutton: SubmitButton,
  phonefield: PhoneField,
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
