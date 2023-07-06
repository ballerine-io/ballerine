export const getWeekDayName = (date: Date) =>
  date.toLocaleDateString('en-US', { weekday: 'short' });
