import { CheckboxList } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/CheckboxList';
import { CountryPicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/CountryPicker';
import { DocumentField } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField';
import { IndustriesPicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/IndustriesPicker';
import { LocalePicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/LocalePicker';
import { Multiselect } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/Multiselect/Multiselect';
import { NationalityPicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/NationalityPicker';
import { StatePicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/StatePicker';
import { withDynamicUIInput } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withDynamicUIInput';
import {
  AutocompleteTextInputAdapter,
  baseLayouts,
  BooleanFieldAdapter,
  DateInputAdater,
  FileInputAdapter,
  PhoneInputAdapter,
  TextInputAdapter,
} from '@ballerine/ui';

export const jsonFormFields = {
  // Component with suffix Field is an overriding of internal RSJV components
  StringField: withDynamicUIInput(TextInputAdapter),
  BooleanField: withDynamicUIInput(BooleanFieldAdapter),

  // Component with suffix Input is an extend of supported field types
  FileInput: withDynamicUIInput(FileInputAdapter),
  DateInput: withDynamicUIInput(DateInputAdater),
  PhoneInput: withDynamicUIInput(PhoneInputAdapter),
  AutocompleteInput: withDynamicUIInput(AutocompleteTextInputAdapter),
  DocumentInput: withDynamicUIInput(DocumentField),
  NationalityPicker: withDynamicUIInput(NationalityPicker),
  LocalePicker: withDynamicUIInput(LocalePicker),
  CountryPicker: withDynamicUIInput(CountryPicker),
  CheckboxList: withDynamicUIInput(CheckboxList),
  IndustriesPicker: withDynamicUIInput(IndustriesPicker),
  Multiselect: withDynamicUIInput(Multiselect),
  StatePicker: withDynamicUIInput(StatePicker),
};

export const jsonFormLayouts = baseLayouts;
