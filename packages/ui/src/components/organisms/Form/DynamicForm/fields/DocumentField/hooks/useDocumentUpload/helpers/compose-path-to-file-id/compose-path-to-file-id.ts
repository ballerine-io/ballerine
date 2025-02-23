export const composePathToFileId = (
  documentIndex: number,
  pageProperty = 'ballerineFileId',
  pageIndex = 0,
) => `[${documentIndex}].pages[${pageIndex}].${pageProperty}`;
