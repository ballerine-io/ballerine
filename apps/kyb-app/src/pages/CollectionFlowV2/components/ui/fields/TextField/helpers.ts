import {
  TTextFieldOptions,
  TTextFieldValueType,
} from '@/pages/CollectionFlowV2/components/ui/fields/TextField/TextField';

export const serializeTextFieldValue = (
  value: unknown,
  valueType: TTextFieldOptions['valueType'],
): TTextFieldValueType => {
  if (valueType === 'integer' || valueType === 'number') {
    return value ? Number(value) : undefined;
  }

  return value as TTextFieldValueType;
};
