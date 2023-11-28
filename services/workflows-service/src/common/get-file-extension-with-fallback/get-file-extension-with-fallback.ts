import { getFileExtension } from '@/common/get-file-extension/get-file-extension';
import mime from 'mime';
import { getMimeType } from '@/common/get-mime-type/get-mime-type';
import { getFileType } from '@/common/get-file-type/get-file-type';

/**
 * Returns file's extension and mime type with fallback for each.
 * @param file - file's path or buffer
 * @param fileName - file's name with extension
 * @param preferFileName - if false, will prefer extracting the file's extension from the file's mime type over file's name
 */
export const getFileExtensionWithFallback = async ({
  file,
  fileName,
  preferFileName = true,
}: {
  file: string | Buffer;
  fileName?: string;
  preferFileName?: boolean;
}) => {
  const fileMetadata = await getFileType(file);
  const mimeType = await getMimeType({ file, fileName });
  let extension;

  if (fileMetadata?.ext) {
    extension = fileMetadata.ext;
  }

  if (!fileMetadata?.ext && fileName && preferFileName) {
    extension = getFileExtension(fileName);
  }

  if (!fileMetadata?.ext && !fileName && mimeType) {
    extension = mime.getExtension(mimeType);
  }

  return extension;
};
