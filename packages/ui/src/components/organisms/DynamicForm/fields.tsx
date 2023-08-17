import { AutocompleteTextInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/AutocompleteTextInputAdapter';
import { BooleanFieldAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/BooleanFieldAdapter';
import { DateInputAdater } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/DateInputAdater';
import { FileInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/FileInputAdapter';
import { PhoneInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/PhoneInputAdapter';
import { TextInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/TextInputAdapter';
import { RJSVInputAdapter } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { RegistryFieldsType } from '@rjsf/utils';

export const fields: Record<keyof RegistryFieldsType, RJSVInputAdapter<any>> = {
  // Component with suffix Field is an overriding of internal RSJV components
  StringField: TextInputAdapter,
  BooleanField: BooleanFieldAdapter,

  // Component with suffix Input is an extend of supported field types
  FileInput: FileInputAdapter,
  DateInput: DateInputAdater,
  PhoneInput: PhoneInputAdapter,
  AutocompleteInput: AutocompleteTextInputAdapter,
};
