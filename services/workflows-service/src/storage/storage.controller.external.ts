import * as common from '@nestjs/common';
import { Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as swagger from '@nestjs/swagger';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express';
// import * as nestAccessControl from 'nest-access-control';
import { StorageService } from './storage.service';
import * as errors from '../errors';
import { fileFilter } from './file-filter';
import { downloadFileFromS3, manageFileByProvider } from '@/storage/get-file-storage-manager';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import * as os from 'os';
import * as path from 'path';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { CustomerService } from '@/customer/customer.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';

// Temporarily identical to StorageControllerInternal
@swagger.ApiTags('Storage')
@common.Controller('external/storage')
export class StorageControllerExternal {
  constructor(
    protected readonly service: StorageService,
    // @nestAccessControl.InjectRolesBuilder()
    // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly scopeService: ProjectScopeService,
    protected readonly customerService: CustomerService,
  ) {}

  /**
   * @deprecated
   */
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
  @UseCustomerAuthGuard()
  async uploadFile(
    @UploadedFile() file: Partial<Express.MulterS3.File>,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return await this.service.createFileLink({
      uri: file.location || String(file.path),
      fileNameOnDisk: String(file.path),
      fileNameInBucket: file.key,
      fileName: file.originalname,
      // Probably wrong. Would require adding a relationship (Prisma) and using connect.
      userId: '',
      projectId: currentProjectId,
      mimeType:
        file.mimetype ||
        (
          await getFileMetadata({
            file: file.originalname || '',
            fileName: file.originalname || '',
          })
        )?.mimeType,
    });
  }

  // curl -v http://localhost:3000/api/v1/storage/1679322938093
  @common.Get('/:id')
  @UseCustomerAuthGuard()
  async getFileById(
    @ProjectIds() projectIds: TProjectIds,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    // currently ignoring user id due to no user info
    const persistedFile = await this.service.getFileById(
      {
        id,
      },
      projectIds,
      {},
    );

    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    return res.send(persistedFile);
  }

  // curl -v http://localhost:3000/api/v1/storage/content/1679322938093
  @common.Get('/content/:id')
  @UseCustomerAuthGuard()
  async fetchFileContent(
    @ProjectIds() projectIds: TProjectIds,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    // currently ignoring user id due to no user info
    const persistedFile = await this.service.getFileById(
      {
        id,
      },
      projectIds,
      {},
    );

    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    let customer;

    if (projectIds?.[0]) {
      customer = await this.customerService.getByProjectId(projectIds?.[0]);
    }

    if (persistedFile.fileNameInBucket) {
      const localFilePath = await downloadFileFromS3(
        AwsS3FileConfig.getBucketName(process.env) as string,
        persistedFile.fileNameInBucket,
      );

      return res.sendFile(localFilePath, { root: '/' });
    } else {
      const root = path.parse(os.homedir()).root;

      return res.sendFile(persistedFile.fileNameOnDisk, { root: root });
    }
  }
}
