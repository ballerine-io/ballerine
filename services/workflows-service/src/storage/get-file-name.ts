import multer from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

export const getFileName: multer.DiskStorageOptions['filename'] = (req, file, callback) => {
  const name = `${randomUUID()}-${Math.floor(Date.now()).toString()}${extname(file.originalname)}`;

  callback(null, name);
};
