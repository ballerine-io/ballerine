import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { TMaximumValidatorParams } from '@ballerine/common';

export const maximumValueValidator: TValidator<number, TMaximumValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Maximum value is {maximum}.' } = params;

  if (typeof value !== 'number') return true;

  if (value > params.value.maximum) {
    throw new Error(formatErrorMessage(message, 'maximum', params.value.maximum.toString()));
  }
};
