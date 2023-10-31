import { RJSFInputProps } from '@components/organisms/DynamicForm/components/RSJVInputAdaters/types';
import { TextInputFieldType } from '../types';

export const detectFieldType = (fieldProps: RJSFInputProps<unknown>): TextInputFieldType => {
  if (fieldProps.schema.oneOf) return 'select';

  return 'text';
};
