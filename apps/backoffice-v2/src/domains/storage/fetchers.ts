import { apiClient } from '../../common/api-client/api-client';
import { Method } from '../../common/enums';
import { z } from 'zod';
import { blobToBase64 } from '../../common/utils/fetch-blob-to-base64/fetch-blob-to-base64';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { FileInfoSchema } from './validation-schemas';

export const fetchFileContentById = async (fileId: string) => {
  const [base64, error] = await apiClient({
    endpoint: `storage/content/${fileId}`,
    method: Method.GET,
    schema: z.instanceof(Blob).transform(blobToBase64),
    isBlob: true,
    timeout: 30000,
  });

  return handleZodError(error, base64);
};

export const fetchFileSignedUrlById = async (fileId: string) => {
  const [res, error] = await apiClient({
    endpoint: `storage/content/${fileId}?format=signed-url`,
    method: Method.GET,
    schema: z.object({ signedUrl: z.string() }),
  });

  return handleZodError(error, res);
};

export const fetchFileInfoById = async (fileId: string) => {
  const [fileInfo, error] = await apiClient({
    endpoint: `storage/${fileId}`,
    method: Method.GET,
    schema: FileInfoSchema,
  });

  return handleZodError(error, fileInfo);
};
export const fetchFileById = async ({
  fileId,
  withSignedUrl = true,
}: {
  fileId: string;
  withSignedUrl?: boolean;
}) => {
  const fileInfo = await fetchFileInfoById(fileId);

  if (withSignedUrl && fileInfo?.fileNameInBucket) {
    const res = await fetchFileSignedUrlById(fileInfo.id);

    return res?.signedUrl;
  }

  return await fetchFileContentById(fileInfo?.id);
};
