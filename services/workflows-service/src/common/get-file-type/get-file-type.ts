import * as fileType from 'file-type';

/**
 * @param file - file's path or buffer
 */
export const getFileType = async (file: string | Buffer) => {
  if (typeof file === 'string') {
    return await fileType.fromFile(file);
  }

  if (Buffer.isBuffer(file)) {
    return await fileType.fromBuffer(file);
  }

  throw new Error(`Invalid file type ${JSON.stringify(file)}`);
};
