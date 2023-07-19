import { uploadFile } from '@app/domains/storage/storage.api';

export const getFilesId = async (files: File[] | File): Promise<string[] | string> => {
  if (Array.isArray(files)) {
    return (await Promise.all(files.map(file => uploadFile({ file })))).map(
      uploadResult => uploadResult.id,
    );
  }

  return (await uploadFile({ file: files })).id;
};
