import { TextInputFieldType } from '@app/common/components/organisms/DynamicForm/components/atoms/TextInput/types';
import { FieldProps } from '@rjsf/utils';

export const detectFieldType = (fieldProps: FieldProps): TextInputFieldType => {
  if (fieldProps.schema.oneOf) return 'select';

  return 'text';
};
