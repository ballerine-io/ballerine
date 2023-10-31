import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const SUPPORTED_FILE_EXT_REGEX = /\.(jpg|jpeg|svg|png|pdf|gif|txt)$/;

export const FILE_MAX_SIZE_IN_KB = 1024;
export const FILE_MAX_SIZE_IN_BYTE = 1048576; // 1 MB

export const fileFilter: MulterOptions['fileFilter'] = (req, file, callback) => {
  const MAX_FILE_SIZE = FILE_MAX_SIZE_IN_KB;
  if (file.size >= MAX_FILE_SIZE) {
    return callback(new Error(`File size exceeded ${MAX_FILE_SIZE}`), false);
  }

  if (!file.originalname.match(SUPPORTED_FILE_EXT_REGEX)) {
    return callback(new Error('File type not allowed'), false);
  }
  callback(null, true);
};
