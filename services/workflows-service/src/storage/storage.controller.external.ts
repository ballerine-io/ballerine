import * as common from '@nestjs/common';
import { Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as swagger from '@nestjs/swagger';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import * as nestAccessControl from 'nest-access-control';
import { StorageService } from './storage.service';
import * as errors from '../errors';
import { fileFilter } from './file-filter';
import { downloadFileFromS3, manageFileByProvider } from '@/storage/get-file-storage-manager';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';

// Temporarily identical to StorageControllerInternal
@swagger.ApiTags('Storage')
@common.Controller('external/storage')
export class StorageControllerExternal {
  constructor(
    protected readonly service: StorageService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: manageFileByProvider(process.env),
      fileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Partial<Express.MulterS3.File>) {
    const id = await this.service.createFileLink({
      uri: file.location || String(file.path),
      fileNameOnDisk: String(file.location),
      fileNameInBucket: file.key,
      // Probably wrong. Would require adding a relationship (Prisma) and using connect.
      userId: '',
    });

    return { id };
  }

  // curl -v http://localhost:3000/api/v1/storage/1679322938093
  @common.Get('/:id')
  async getFileById(@Param('id') id: string, @Res() res: Response) {
    // currently ignoring user id due to no user info
    const persistedFile = await this.service.getFileNameById({
      id,
    });
    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    return res.send(persistedFile);
  }

  // curl -v http://localhost:3000/api/v1/storage/content/1679322938093
  @common.Get('/content/:id')
  async fetchFileContent(@Param('id') id: string, @Res() res: Response) {
    // currently ignoring user id due to no user info
    const persistedFile = await this.service.getFileNameById({
      id,
    });
    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    if (persistedFile.fileNameInBucket) {
      const localFilePath = await downloadFileFromS3(
        AwsS3FileConfig.fetchBucketName(process.env) as string,
        persistedFile.fileNameInBucket,
      );
      return res.sendFile(localFilePath, { root: '/' });
    } else {
      return res.sendFile(persistedFile.fileNameOnDisk, { root: './upload' });
    }
  }
}
