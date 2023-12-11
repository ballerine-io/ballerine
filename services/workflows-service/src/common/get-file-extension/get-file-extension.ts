export const getFileExtension = (fileName: string) => {
  const parts = fileName?.split('.');

  if (!parts?.length) return;

  return parts?.[parts?.length - 1]?.split('?')?.[0];
};
