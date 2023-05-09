import { z } from 'zod';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { apiClient } from './api-client';
import { endpoints } from './endpoints';

import { blobToBase64 } from '../utils/blob-to-base64/blob-to-base64';
import { FileInfoSchema } from '../lib/zod/schemas/file-info';

export const storage = {
  fileById: async (fileId: string) => {
    const [fileInfoResponse, fetchFileError] = await apiClient({
      endpoint: endpoints.storage.fileById.endpoint(fileId),
      method: endpoints.storage.fileById.method,
      schema: FileInfoSchema,
    });
    const fileInfo = handleZodError(fetchFileError, fileInfoResponse);

    const [blob, fetchFileContentError] = await apiClient({
      endpoint: endpoints.storage.fileContentById.endpoint(fileInfo.id),
      method: endpoints.storage.fileById.method,
      schema: z.instanceof(Blob),
      isBlob: true,
    });
    const data = handleZodError(fetchFileContentError, blob);

    return blobToBase64(data);
  },
};
