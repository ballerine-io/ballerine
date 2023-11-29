import { getFileExtension } from '@/common/get-file-extension/get-file-extension';
import mime from 'mime';
import { getFileType } from '@/common/get-file-type/get-file-type';

/**
 * Returns file's extension with fallback.
 * @param file - file's path or buffer
 * @param fileName - file's name with extension
 */
export const getFileExtensionWithFallback = async ({
  file,
  fileName,
}: {
  file: string | Buffer;
  fileName?: string;
}) => {
  const fileMetadata = await getFileType(file);

  if (fileMetadata?.ext) {
    return fileMetadata.ext;
  }

  if (fileName) {
    return getFileExtension(fileName);
  }

  if (fileMetadata?.mime) {
    return mime.getExtension(fileMetadata.mime) ?? undefined;
  }

  return;
};
