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

export const convertTimeUnitToMilliseconds = (dedupeWindow: {
  timeAmount: number;
  timeUnit: TimeUnit;
}): number => {
  let multiplier = 0;

  switch (dedupeWindow.timeUnit) {
    case 'days':
      multiplier = 24 * 60 * 60 * 1000; // Convert days to milliseconds
      break;
    case 'hours':
      multiplier = 60 * 60 * 1000; // Convert hours to milliseconds
      break;
    case 'minutes':
      multiplier = 60 * 1000; // Convert minutes to milliseconds
      break;
    default:
      throw new Error(`Unknown time unit: ${dedupeWindow.timeUnit}`);
  }

  return dedupeWindow.timeAmount * multiplier;
};
