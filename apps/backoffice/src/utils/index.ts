/**
 * @description Checks if a passed string is a date by checking if creating a new Date object from it returns NaN.
 * @param str
 */
export const isValidDate = (str: string) => {
  const date = new Date(str);

  return !isNaN(date.getTime());
};
/**
 * @description Returns a string from a passed date in the format of '15 Apr 2023'.
 * @param date
 */
export const formatDate = (date: Date) => {
  const month = date.toLocaleString('default', { month: 'short' });

  return `${date.getDate()} ${month} ${date.getFullYear()}`;
};
