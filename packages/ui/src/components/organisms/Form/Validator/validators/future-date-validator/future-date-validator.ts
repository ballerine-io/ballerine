import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TBaseValidators, TValidator } from '../../types';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const futureDateValidator: TValidator<string, unknown, TBaseValidators | 'document'> = (
  value,
  params,
) => {
  const { message = 'Date must be in the future.' } = params;

  if (!dayjs(value).isValid()) {
    throw new Error('Invalid date.');
  }

  const isFutureDate = dayjs(value).isAfter(dayjs());

  if (!isFutureDate) {
    throw new Error(message);
  }

  return true;
};
