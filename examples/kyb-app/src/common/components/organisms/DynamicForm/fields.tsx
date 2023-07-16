import { FileInput } from '@app/common/components/organisms/DynamicForm/components/atoms/FileInput';
import { TextInput } from './components/atoms/TextInput/TextInput';
import { RegistryFieldsType } from '@rjsf/utils';

export const fields: RegistryFieldsType = {
  StringField: TextInput,
  FileInput: FileInput,
};
