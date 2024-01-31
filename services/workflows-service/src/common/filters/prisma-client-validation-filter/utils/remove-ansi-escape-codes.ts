export const removeAnsiEscapeCodes = (string: string): string => {
  // eslint-disable-next-line no-control-regex
  return string.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
};
