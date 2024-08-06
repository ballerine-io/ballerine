import { CheckboxList } from '@/components/organisms/UIRenderer/elements/JSONForm/components/CheckboxList';
import { CountryPicker } from '@/components/organisms/UIRenderer/elements/JSONForm/components/CountryPicker';
import { IndustriesPicker } from '@/components/organisms/UIRenderer/elements/JSONForm/components/IndustriesPicker';
import { LocalePicker } from '@/components/organisms/UIRenderer/elements/JSONForm/components/LocalePicker';
import { MCCPicker } from '@/components/organisms/UIRenderer/elements/JSONForm/components/MCCPicker';
import { Multiselect } from '@/components/organisms/UIRenderer/elements/JSONForm/components/Multiselect/Multiselect';
import { NationalityPicker } from '@/components/organisms/UIRenderer/elements/JSONForm/components/NationalityPicker';
import { RelationshipDropdown } from '@/components/organisms/UIRenderer/elements/JSONForm/components/RelationshipDropdown';
import { StatePicker } from '@/components/organisms/UIRenderer/elements/JSONForm/components/StatePicker';
import {
  AutocompleteTextInputAdapter,
  baseLayouts,
  BooleanFieldAdapter,
  DateInputAdapter,
  FileInputAdapter,
  PhoneInputAdapter,
  TextInputAdapter,
} from '@ballerine/ui';
import { DocumentField } from './components/DocumentField';
import { FieldTemplate } from './components/FieldTemplate';
import { JSONFormArrayFieldLayout } from './components/JSONFormArrayFieldLayout';
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
