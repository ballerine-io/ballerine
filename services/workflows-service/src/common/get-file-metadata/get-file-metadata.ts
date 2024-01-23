import { getFileType } from '@/common/get-file-type/get-file-type';
import { MimeType } from 'file-type';
import mime from 'mime';
import { getFileExtension } from '@/common/get-file-extension/get-file-extension';
import { log } from '@ballerine/common';

/**
 *
 * @param file - file's path or buffer
 * @param fileName - file's name with extension
 */
export const getFileMetadata = async ({
  file,
  fileName,
}: {
  file: string | Buffer;
  fileName?: string;
}) => {
  const fileMetadata = await getFileType(file);
  let mimeType: MimeType | string | undefined;
  let extension;

  if (fileMetadata?.mime) {
    mimeType = fileMetadata.mime;
  }

  if (!fileMetadata?.mime && fileName) {
    mimeType = mime.getType(fileName) ?? undefined;
  }

  if (fileMetadata?.ext) {
    extension = fileMetadata.ext;
  }

  if (!fileMetadata?.ext && fileName) {
    extension = getFileExtension(fileName);
  }

  if (!fileMetadata?.ext && !fileName && mimeType) {
    extension = mime.getExtension(mimeType) ?? undefined;
  }

  if (extension && !mimeType) {
    mimeType = mime.getType(extension) ?? undefined;
  }

  log(!mimeType, `Could not extract mime type from file: ${file} with a file name of: ${fileName}`);
  log(
    !extension,
    `Could not extract file extension from file: ${file} with a file name of: ${fileName}`,
  );

  return {
    mimeType,
    extension,
  };
};
