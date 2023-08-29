import { fetchFile } from '@app/domains/storage/storage.api';

export interface FilePayload {
  fieldName: string;
  fileId: string;
  file: File | null;
}

export const downloadAndBuildFiles = async (filesPayload: FilePayload[]) => {
  return await Promise.all(
    filesPayload.map(async filePayload => {
      const fileMetadata = await fetchFile(filePayload.fileId);

      const documentFile = new File(
        [''],
        fileMetadata.fileNameInBucket || fileMetadata.fileNameOnDisk,
        { type: 'text/plain' },
      );

      return {
        ...filePayload,
        file: documentFile,
      };
    }),
  );
};
