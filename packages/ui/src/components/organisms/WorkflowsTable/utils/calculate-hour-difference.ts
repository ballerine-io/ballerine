import dayjs from 'dayjs';

export function calculateHourDifference(dateA: Date, dateB: Date) {
  return Math.abs(dayjs(dateB).diff(dateA, 'hour', false));
}
