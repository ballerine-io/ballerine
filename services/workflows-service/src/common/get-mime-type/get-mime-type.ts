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

  if (fileMetadata?.mime) {
    return fileMetadata?.mime;
  }

  if (fileName) {
    return mime.getType(fileName);
  }

  return null;
};
