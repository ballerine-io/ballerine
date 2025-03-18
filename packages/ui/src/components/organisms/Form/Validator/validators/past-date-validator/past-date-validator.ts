import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TBaseValidators, TValidator } from '../../types';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const pastDateValidator: TValidator<string, unknown, TBaseValidators | 'document'> = (
  value,
  params,
) => {
  const { message = 'Date must be in the past.' } = params;

  if (!dayjs(value).isValid()) {
    throw new Error('Invalid date.');
  }

  const isPastOrCurrentDate = dayjs(value).isSameOrBefore(dayjs(), 'day');

  if (!isPastOrCurrentDate) {
    throw new Error(message);
  }

  return true;
};
