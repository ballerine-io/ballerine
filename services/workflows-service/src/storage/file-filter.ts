import { formatBytes } from '@/common/utils/bytes';
import { SUPPORTED_FILE_EXT_REGEX } from '@ballerine/common';
import { FILE_MAX_SIZE_IN_BYTE, FILE_MAX_SIZE_IN_KB } from '@/common/consts/file-size.consts';
import { UnprocessableEntityException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

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
