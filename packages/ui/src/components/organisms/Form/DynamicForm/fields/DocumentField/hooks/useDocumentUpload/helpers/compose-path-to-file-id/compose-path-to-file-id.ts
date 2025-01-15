export const composePathToFileId = (
  documentIndex: number,
  pageProperty: string,
  pageIndex: number,
) => `[${documentIndex}].pages[${pageIndex}].${pageProperty}`;
