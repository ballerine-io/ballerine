import {
  AutocompleteTextInputAdapter,
  baseLayouts,
  BooleanFieldAdapter,
  DateInputAdapter,
  FileInputAdapter,
  PhoneInputAdapter,
  TextInputAdapter,
} from '@ballerine/ui';
import { CheckboxList } from './components/CheckboxList';
import { CountryPicker } from './components/CountryPicker';
import { DocumentField } from './components/DocumentField';
import { FieldTemplate } from './components/FieldTemplate';
import { IndustriesPicker } from './components/IndustriesPicker';
import { JSONFormArrayFieldLayout } from './components/JSONFormArrayFieldLayout';
import { LocalePicker } from './components/LocalePicker';
import { MCCPicker } from './components/MCCPicker';
import { Multiselect } from './components/Multiselect/Multiselect';
import { NationalityPicker } from './components/NationalityPicker';
import { RelationshipDropdown } from './components/RelationshipDropdown';
import { StatePicker } from './components/StatePicker';
import { withDynamicUIInputV2 } from './hocs/withDynamicUIInput';

export const jsonFormFields = {
  // Component with suffix Field is an overriding of internal RSJV components
  StringField: withDynamicUIInputV2(TextInputAdapter),
  BooleanField: withDynamicUIInputV2(BooleanFieldAdapter),

  // Component with suffix Input is an extend of supported field types
  FileInput: withDynamicUIInputV2(FileInputAdapter),
  DateInput: withDynamicUIInputV2(DateInputAdapter),
  PhoneInput: withDynamicUIInputV2(PhoneInputAdapter),
  AutocompleteInput: withDynamicUIInputV2(AutocompleteTextInputAdapter),
  DocumentInput: withDynamicUIInputV2(DocumentField),
  NationalityPicker: withDynamicUIInputV2(NationalityPicker),
  LocalePicker: withDynamicUIInputV2(LocalePicker),
  CountryPicker: withDynamicUIInputV2(CountryPicker),
  CheckboxList: withDynamicUIInputV2(CheckboxList),
  IndustriesPicker: withDynamicUIInputV2(IndustriesPicker),
  Multiselect: withDynamicUIInputV2(Multiselect),
  StatePicker: withDynamicUIInputV2(StatePicker),
  RelationshipDropdown: withDynamicUIInputV2(RelationshipDropdown),
  MCCPicker: withDynamicUIInputV2(MCCPicker),
};

export const jsonFormLayouts = {
  ...baseLayouts,
  FieldTemplate,
  ArrayFieldTemplate: JSONFormArrayFieldLayout,
};
