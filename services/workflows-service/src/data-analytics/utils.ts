import { TIME_UNITS } from './consts';
import { TimeUnit } from './types';

export const calculateStartDate = (timeUnit: TimeUnit, timeAmount: number): Date => {
  const currentDate = new Date(); // Current date
  const startDate = new Date(currentDate); // Clone the current date to manipulate

  switch (timeUnit) {
    case TIME_UNITS.minutes:
      startDate.setMinutes(currentDate.getMinutes() - timeAmount);
      break;
    case TIME_UNITS.hours:
      startDate.setHours(currentDate.getHours() - timeAmount);
      break;
    case TIME_UNITS.days:
      startDate.setDate(currentDate.getDate() - timeAmount);
      break;
    case TIME_UNITS.weeks:
      startDate.setDate(currentDate.getDate() - timeAmount * 7); // 1 week = 7 days
      break;
    case TIME_UNITS.months:
      startDate.setMonth(currentDate.getMonth() - timeAmount);
      break;
    case TIME_UNITS.years:
      startDate.setFullYear(currentDate.getFullYear() - timeAmount);
      break;
    default:
      throw new Error(`Invalid time unit: ${timeUnit}`);
  }

  return startDate;
};
