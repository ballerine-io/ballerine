export const getArrayFieldItemTitleIndex = (fieldId: string): number | null => {
  const lastIndex = fieldId.lastIndexOf('__');

  if (lastIndex === -1) return null;

  const parseResult = parseInt(fieldId.slice(lastIndex - 1, lastIndex));

  return typeof parseResult === 'number' && !isNaN(parseResult) ? parseResult : null;
};
