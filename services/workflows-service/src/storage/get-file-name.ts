import multer from 'multer';

export const getFileName: multer.DiskStorageOptions['filename'] = (req, file, callback) => {
  const time = Math.floor(Date.now()).toString();
  callback(null, time);
};
