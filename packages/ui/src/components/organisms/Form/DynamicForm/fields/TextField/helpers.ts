import { ITextFieldParams } from './TextField';

export const serializeTextFieldValue = (
  value: unknown,
  valueType: ITextFieldParams['valueType'],
) => {
  if (valueType === 'integer' || valueType === 'number') {
    return value ? Number(value) : undefined;
  }

  return !value ? undefined : value;
};
