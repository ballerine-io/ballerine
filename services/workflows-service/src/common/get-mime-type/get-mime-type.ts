import { MimeType } from 'file-type';
import mime from 'mime';

import { getFileType } from '@/common/get-file-type/get-file-type';

/**
 * Returns file's mime type with fallback.
 * @param file - file's path or buffer
 * @param fileName - file's name with extension
 */
export const getMimeType = async ({
  file,
  fileName,
}: {
  file: string | Buffer;
  fileName?: string;
}) => {
  const fileMetadata = await getFileType(file);
  let mimeType: MimeType | string | null = null;

  if (fileMetadata?.mime) {
    mimeType = fileMetadata.mime;
  }

  if (!fileMetadata?.mime && fileName) {
    mimeType = mime.getType(fileName);
  }

  return mimeType;
};
