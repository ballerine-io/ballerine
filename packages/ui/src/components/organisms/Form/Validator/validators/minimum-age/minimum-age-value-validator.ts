import dayjs from 'dayjs';
import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message/format-error-message';
import { IMinimumAgeValidatorParams } from './types';

export const minimumAgeValueValidator: TValidator<string, IMinimumAgeValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Minimum age is {minimumAge}.' } = params;

  if (!dayjs(value).isValid()) {
    throw new Error('Invalid date.');
  }

  const requiredAge = params?.value?.minimumAge;

  if (!requiredAge) {
    throw new Error('Minimum age is not specified.');
  }

  const today = dayjs();
  const birthDate = dayjs(value);

  // Calculate age considering month and day
  let age = today.year() - birthDate.year();
  const monthDiff = today.month() - birthDate.month();

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
    age--;
  }

  if (age < requiredAge) {
    throw new Error(formatErrorMessage(message, 'minimumAge', requiredAge.toString()));
  }

  return true;
};
