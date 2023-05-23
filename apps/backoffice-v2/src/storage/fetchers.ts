import { apiClient } from '../api/api-client';
import { Method } from '../enums';
import { z } from 'zod';
import { blobToBase64 } from '../utils/fetch-blob-to-base64/fetch-blob-to-base64';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { FileInfoSchema } from './validation-schemas';

export const fetchFileContentById = async (fileId: string) => {
  const [base64, error] = await apiClient({
    endpoint: `storage/content/${fileId}`,
    method: Method.GET,
    schema: z.instanceof(Blob).transform(blobToBase64),
    isBlob: true,
  });

  return handleZodError(error, base64);
};

export const fetchFileInfoById = async (fileId: string) => {
  const [fileInfo, error] = await apiClient({
    endpoint: `storage/${fileId}`,
    method: Method.GET,
    schema: FileInfoSchema,
  });

  return handleZodError(error, fileInfo);
};
export const fetchFileById = async (fileId: string) => {
  const fileInfo = await fetchFileInfoById(fileId);
  const fileContent = await fetchFileContentById(fileInfo.id);

  return fileContent;
};
