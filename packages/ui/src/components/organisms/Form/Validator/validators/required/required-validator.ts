import { TValidator } from '../../types';
import { IRequiredValueValidatorParams } from './types';

export const requiredValueValidator: TValidator<unknown, IRequiredValueValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Required value.' } = params;

  if (value === undefined || value === null || value === '') {
    throw new Error(message);
  }
};
