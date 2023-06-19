import { isObject } from '@/utils';

import { IErrorWithName } from '@/utils/is-error-with-name/interfaces';

export const isErrorWithName = (error: unknown): error is IErrorWithName => {
  return isObject(error) && 'name' in error && typeof error.name === 'string';
};
