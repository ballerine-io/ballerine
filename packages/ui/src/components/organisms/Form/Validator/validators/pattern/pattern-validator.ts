import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { TPatternValidatorParams } from '@ballerine/common';

export const patternValueValidator: TValidator<string, TPatternValidatorParams> = (
  value,
  params,
) => {
  const { message = `Value must match {pattern}.` } = params;

  if (typeof value !== 'string') return true;

  if (!new RegExp(params.value.pattern, params.value.flags).test(value as string)) {
    throw new Error(formatErrorMessage(message, 'pattern', params.value.pattern));
  }
};
