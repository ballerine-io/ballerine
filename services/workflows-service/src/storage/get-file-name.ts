import { generateRandomId } from '@/common/utils/random';
import multer from 'multer';
import { extname } from 'path';

export const getFileName: multer.DiskStorageOptions['filename'] = (req, file, callback) => {
  const name = `${generateRandomId(8)}-${Math.floor(Date.now()).toString()}${extname(
    file.originalname,
  )}`;

  callback(null, name);
};
