import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { IMaximumValueValidatorParams } from './types';

export const maximumValueValidator: TValidator<number, IMaximumValueValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Maximum value is {maximum}.' } = params;

  if (typeof value !== 'number') return true;

  if (value > params.value.maximum) {
    throw new Error(formatErrorMessage(message, 'maximum', params.value.maximum.toString()));
  }
};
