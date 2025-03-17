import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { IPatternValidatorParams } from './types';

export const patternValueValidator: TValidator<string, IPatternValidatorParams> = (
  value,
  params,
) => {
  const { message = `Value must match {pattern}.` } = params;

  if (typeof value !== 'string') return true;

  if (!new RegExp(params.value.pattern).test(value as string)) {
    throw new Error(formatErrorMessage(message, 'pattern', params.value.pattern));
  }
};
