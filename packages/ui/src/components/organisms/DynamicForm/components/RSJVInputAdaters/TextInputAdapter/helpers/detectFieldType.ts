import { TextInputFieldType } from '../types';
import { FieldProps } from '@rjsf/utils';

export const detectFieldType = (fieldProps: FieldProps): TextInputFieldType => {
  if (fieldProps.schema.oneOf) return 'select';

  return 'text';
};
