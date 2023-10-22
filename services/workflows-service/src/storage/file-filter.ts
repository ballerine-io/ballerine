import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const fileFilter: MulterOptions['fileFilter'] = (req, file, callback) => {
  const MAX_FILE_SIZE = 1024;
  if (file.size >= MAX_FILE_SIZE) {
    return callback(new Error(`File size exceeded ${MAX_FILE_SIZE}`), false);
  }

  if (!file.originalname.match(/\.(jpg|jpeg|svg|png|gif|pdf|txt)$/)) {
    return callback(new Error('File type not allowed'), false);
  }
  callback(null, true);
};
