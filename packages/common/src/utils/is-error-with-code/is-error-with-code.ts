import { isObject } from '@/utils';
import { IErrorWithCode } from '@/utils/is-error-with-code/interfaces';

export const isErrorWithCode = (error: unknown): error is IErrorWithCode => {
  return isObject(error) && 'code' in error && typeof error.code === 'number';
};
