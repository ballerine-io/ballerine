// Adds a space between camelCase words
export const camelCaseToSpace = (str: string) => {
  if (typeof str !== 'string') return str;

  return str?.split(/(?=[A-Z])/g).join(' ');
};
