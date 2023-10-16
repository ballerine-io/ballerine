import { CheckboxList } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/CheckboxList';
import { DocumentField } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField';
import { NationalityPicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/NationalityPicker';
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
import { CountryPicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/CountryPicker';

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
  CountryPicker: withDynamicUIInput(CountryPicker),
  CheckboxList: withDynamicUIInput(CheckboxList),
};

export const jsonFormLayouts = baseLayouts;
