import { getFileExtension } from '@/common/get-file-extension/get-file-extension';
import mime from 'mime';
import { getMimeType } from '@/common/get-mime-type/get-mime-type';
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
  const mimeType = await getMimeType({ file, fileName });

  if (fileMetadata?.ext) {
    return fileMetadata.ext;
  }

  if (!fileMetadata?.ext && fileName) {
    return getFileExtension(fileName);
  }

  if (!fileMetadata?.ext && !fileName && mimeType) {
    return mime.getExtension(mimeType);
  }

  return null;
};
