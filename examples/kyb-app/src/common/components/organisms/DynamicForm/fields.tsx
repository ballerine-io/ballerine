import { FileInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/FileInputAdapter';
import { RegistryFieldsType } from '@rjsf/utils';
import { TextInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/TextInputAdapter';
import { DateInputAdater } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/DateInputAdater';
import { PhoneInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/PhoneInputAdapter';
import { RJSVInputAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { BooleanFieldAdapter } from '@app/common/components/organisms/DynamicForm/components/RSJVInputAdaters/BooleanFieldAdapter';

export const fields: Record<keyof RegistryFieldsType, RJSVInputAdapter<any>> = {
  // Component with suffix Field is an overriding of internal RSJV components
  StringField: TextInputAdapter,
  BooleanField: BooleanFieldAdapter,

  // Component with suffix Input is an extend of supported field types
  FileInput: FileInputAdapter,
  DateInput: DateInputAdater,
  PhoneInput: PhoneInputAdapter,
};
