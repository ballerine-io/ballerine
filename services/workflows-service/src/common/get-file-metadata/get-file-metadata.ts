import { getFileExtensionWithFallback } from '@/common/get-file-extension-with-fallback/get-file-extension-with-fallback';
import { getMimeType } from '@/common/get-mime-type/get-mime-type';

/**
 *
 * @param file - file's path or buffer
 * @param fileName - file's name with extension
 * @param preferFileName - if false, will prefer extracting the file's extension from the file's mime type over file's name
 */
export const getFileMetadata = async ({
  file,
  fileName,
  preferFileName = true,
}: {
  file: string | Buffer;
  fileName?: string;
  preferFileName?: boolean;
}) => {
  const mimeType = await getMimeType({ file, fileName });
  const extension = await getFileExtensionWithFallback({
    file,
    fileName,
    preferFileName,
  });

  return {
    mimeType,
    extension,
  };
};
