export const getFileExtension = (fileName: string) => {
  const parts = fileName?.split('.');

  if (!parts?.length) return;

  const extension = parts?.[parts?.length - 1];
  // For Handling URLs
  const extensionWithoutQueryParams = extension?.split('?')[0];

  return extensionWithoutQueryParams;
};
