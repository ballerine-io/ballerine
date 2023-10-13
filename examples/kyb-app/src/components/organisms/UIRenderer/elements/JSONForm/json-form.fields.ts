import { CheckboxList } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/CheckboxList';
import { DocumentField } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/DocumentField';
import { NationalityPicker } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/NationalityPicker';
import { withDynamicUIInterceptor } from '@app/components/organisms/UIRenderer/elements/JSONForm/hocs/withDynamicUIInterceptor/withDynamicUIInterceptor';
import {
  TextInputAdapter,
  BooleanFieldAdapter,
  FileInputAdapter,
  DateInputAdater,
  PhoneInputAdapter,
  AutocompleteTextInputAdapter,
} from '@ballerine/ui';

export const jsonFormFields = {
  // Component with suffix Field is an overriding of internal RSJV components
  StringField: withDynamicUIInterceptor(TextInputAdapter),
  BooleanField: withDynamicUIInterceptor(BooleanFieldAdapter),

  // Component with suffix Input is an extend of supported field types
  FileInput: withDynamicUIInterceptor(FileInputAdapter),
  DateInput: withDynamicUIInterceptor(DateInputAdater),
  PhoneInput: withDynamicUIInterceptor(PhoneInputAdapter),
  AutocompleteInput: withDynamicUIInterceptor(AutocompleteTextInputAdapter),
  DocumentInput: withDynamicUIInterceptor(DocumentField),
  NationalityPicker: withDynamicUIInterceptor(NationalityPicker),
  CheckboxList: withDynamicUIInterceptor(CheckboxList),
};
