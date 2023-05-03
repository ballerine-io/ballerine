import * as common from '@nestjs/common';
import { Post, UseInterceptors, UploadedFile, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as swagger from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as nestAccessControl from 'nest-access-control';
import { StorageService } from './storage.service';
import * as errors from '../errors';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { fileFilter } from './file-filter';
import { getFileName } from './get-file-name';
import { manageFileByProvider } from '@/storage/get-file-storage-manager';

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
      storage: manageFileByProvider(),
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const id = await this.service.createFileLink({
      uri: file.path,
      fileNameOnDisk: file.filename,
      // Probably wrong. Would require adding a relationship (Prisma) and using connect.
      userId: '',
    });

    return { id };
  }

  // curl -v http://localhost:3000/api/storage/1679322938093
  @common.Get('/:id')
  async getFileById(@Param('id') id: string, @Res() res: Response) {
    // currently ignoring user id due to no user info
    const fileNameOnDisk = await this.service.getFileNameById({
      id,
      userId: '',
    });

    if (!fileNameOnDisk) {
      throw new errors.NotFoundException('file not found');
    }

    return res.sendFile(fileNameOnDisk, { root: './upload' });
  }
}
