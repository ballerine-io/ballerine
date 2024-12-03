import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { IMinimumValueValidatorParams } from './types';

export const minimumValueValidator: TValidator<number, IMinimumValueValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Minimum value is {minimum}.' } = params;

  if (typeof value !== 'number') return true;

  if (value < params.value.minimum) {
    throw new Error(formatErrorMessage(message, 'minimum', params.value.minimum.toString()));
  }
};
