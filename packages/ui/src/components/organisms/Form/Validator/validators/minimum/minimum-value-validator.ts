import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { TMinimumValidatorParams } from '@ballerine/common';

export const minimumValueValidator: TValidator<number, TMinimumValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Minimum value is {minimum}.' } = params;

  if (typeof value !== 'number') return true;

  if (value < params.value.minimum) {
    throw new Error(formatErrorMessage(message, 'minimum', params.value.minimum.toString()));
  }
};
