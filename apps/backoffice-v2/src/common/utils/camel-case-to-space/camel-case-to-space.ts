// Adds a space between camelCase words
export const camelCaseToSpace = (str: string) => {
  if (typeof str !== 'string') return str;

  return str.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
};
