import * as fileType from 'file-type';

/**
 * @param file - file's path or buffer
 */
export const getFileType = async (file: string | Buffer) => {
  try {
    if (typeof file === 'string') {
      return await fileType.fromFile(file);
    }

    if (Buffer.isBuffer(file)) {
      return await fileType.fromBuffer(file);
    }
  } catch (err) {
    console.error('An error has occurred while trying to extract file type', err);

    return;
  }

  throw new Error(`Invalid file type ${JSON.stringify(file)}`);
};
