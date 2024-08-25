import { isObject } from '@ballerine/common';

export const formatValue = ({ key, value }: { key: string; value: unknown }) => {
  if (key === 'address' && isObject(value)) {
    return [value?.Line1, value?.Line2, value?.City, value?.Country].filter(Boolean).join(', ');
  }

  return value;
};
