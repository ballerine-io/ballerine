// Turns a string of 'snake_case' into 'snake case'.
export const snakeCaseToWords = (str: string) => {
  if (typeof str !== 'string') return str;

  return str?.replace('_', ' ');
};
