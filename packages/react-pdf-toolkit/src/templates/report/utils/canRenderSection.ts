import { AnyObject } from '@ballerine/ui';

// This helper
const isObjectPropertiesHasAnyValue = (obj: AnyObject) => {
  let hasValue = false;

  for (const key in obj) {
    const value = obj[key];

    if (Array.isArray(value) && !value.length) continue;

    if (typeof value === 'object' && isObjectPropertiesHasAnyValue(value)) {
      hasValue = true;
      break;
    } else {
      if (value && typeof value !== 'object') {
        hasValue = true;
        break;
      }
    }
  }

  return hasValue;
};

export const canRenderSection = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;

  if (typeof value === 'object' && !isObjectPropertiesHasAnyValue(value)) {
    return false;
  }

  return true;
};
