// Capitalizes the first letter of a string and lower-cases the rest.
export const toStartCase = (str: string) => {
  if (typeof str !== 'string') return str;

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
