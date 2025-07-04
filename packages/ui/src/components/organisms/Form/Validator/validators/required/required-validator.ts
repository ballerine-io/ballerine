import { TValidator } from '../../types';
import { TRequiredValidatorParams } from '@ballerine/common';

export const requiredValueValidator: TValidator<unknown, TRequiredValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Required value.' } = params;

  if (value === undefined || value === null || value === '') {
    throw new Error(message);
  }
};
