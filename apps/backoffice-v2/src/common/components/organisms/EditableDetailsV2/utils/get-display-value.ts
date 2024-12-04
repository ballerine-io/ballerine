import { isNullish } from '@ballerine/common';

export const getDisplayValue = <TValue, TOriginalValue>({
  value,
  originalValue,
  isEditable,
}: {
  value: TValue;
  originalValue: TOriginalValue;
  isEditable: boolean;
}) => {
  if (isEditable) {
    return originalValue;
  }

  if (isNullish(value) || value === '') {
    return 'N/A';
  }

  return value;
};
