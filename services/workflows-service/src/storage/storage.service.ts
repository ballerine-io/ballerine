import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { Prisma } from '@prisma/client';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class StorageService {
  constructor(
    protected readonly fileRepository: FileRepository,
    protected readonly projectScopeService: ProjectScopeService,
  ) {}

  async createFileLink({
    uri,
    fileNameOnDisk,
    userId,
    fileNameInBucket,
    projectIds,
    mimeType,
  }: Pick<
    Prisma.FileCreateInput,
    'uri' | 'fileNameOnDisk' | 'userId' | 'fileNameInBucket' | 'mimeType'
  > & {
    projectIds: TProjectIds;
  }) {
    const file = await this.fileRepository.create(
      this.projectScopeService.scopeCreate(
        {
          data: {
            uri,
            fileNameOnDisk,
            userId,
            fileNameInBucket,
            mimeType,
          },
          select: {
            id: true,
          },
        },
        projectIds,
      ),
    );

    return file.id;
  }

  async getFileNameById({ id }: IFileIds, args?: Prisma.FileFindFirstArgs) {
    return await this.fileRepository.findById({ id }, args || {});
  }
}
