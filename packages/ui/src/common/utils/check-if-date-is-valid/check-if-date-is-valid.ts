export const checkIfDateIsValid = (inputDate: string | Date | number): boolean => {
  const date = new Date(inputDate);

  if (date.getFullYear() < 1000) return false;

  return true;
};
