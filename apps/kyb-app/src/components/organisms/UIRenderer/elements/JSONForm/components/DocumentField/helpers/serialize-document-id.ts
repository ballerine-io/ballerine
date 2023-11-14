export const serializeDocumentId = (baseId: string, index: number): string => {
  return baseId.replace('[{INDEX}]', String(index));
};
