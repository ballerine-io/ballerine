import { formatBytes } from '@/common/utils/bytes';
import { UnprocessableEntityException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const SUPPORTED_FILE_EXT_REGEX = /\.(jpg|jpeg|svg|png|pdf|gif|txt|csv|xlsx|xls)$/;

export const FILE_MAX_SIZE_IN_KB = 1024;
export const FILE_MAX_SIZE_IN_BYTE = 10 * FILE_MAX_SIZE_IN_KB * 1024; // 10 MB

export const FILE_SIZE_EXCEEDED_MSG = `File size exceeded ${formatBytes(FILE_MAX_SIZE_IN_BYTE)}`;
export const FILE_TYPE_NOT_SUPPORTED_MSG = 'File type not supported';

export const fileFilter: MulterOptions['fileFilter'] = (req, file, callback) => {
  const MAX_FILE_SIZE = FILE_MAX_SIZE_IN_KB;

  if (file.size >= MAX_FILE_SIZE) {
    return callback(new UnprocessableEntityException(FILE_SIZE_EXCEEDED_MSG), false);
  }

  if (!file.originalname.match(SUPPORTED_FILE_EXT_REGEX)) {
    return callback(new UnprocessableEntityException(FILE_TYPE_NOT_SUPPORTED_MSG), false);
  }

  callback(null, true);
};
