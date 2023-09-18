import { isNullish } from '@ballerine/common';
import { AnyObject } from '@ballerine/ui';

export const isNullishDateValue = <T = unknown>(value: T, jsonSchema: AnyObject): boolean => {
  if (isNullish(value) && jsonSchema?.format === 'date') return true;

  return false;
};

export const isValueEligibleToBePersisted = <T = unknown>(value: T, jsonSchema: AnyObject = {}) => {
  if (!isNullishDateValue(value, jsonSchema)) return true;

  if (isNullish(value)) return false;

  return true;
};

export const serializeValue = <T = unknown>(value: T, jsonSchema: AnyObject): T => {
  // TO DO: This should convert falsy date value empty string/null/undefined to null
  // This can't be done with current schemas,we can't send undefined as JSON value which means date can't be overwrited
  if (isNullishDateValue(value, jsonSchema)) return undefined;

  return value;
};
