import { uploadFile } from '@app/domains/storage/storage.api';

export const getFilesId = async (files: File[]): Promise<string[]> => {
  return (await Promise.all(files.map(file => uploadFile({ file })))).map(
    uploadResult => uploadResult.id,
  );
};
