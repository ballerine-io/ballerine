export const serializeDocumentId = (baseId: string, index: number): string => {
  return baseId.replace('[{INDEX}]', `[index:${String(index)}]`);
};

export const deserializeDocumentId = (id: string): string => {
  const result = id.replace(/\[index:\d+\]/g, '[{INDEX}]');
  return result;
};
