import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { Prisma } from '@prisma/client';
import { TProjectId, TProjectIds } from '@/types';

@Injectable()
export class StorageService {
  constructor(protected readonly fileRepository: FileRepository) {}

  async createFileLink({
    uri,
    fileNameOnDisk,
    userId,
    fileNameInBucket,
    projectId,
  }: Pick<Prisma.FileCreateInput, 'uri' | 'fileNameOnDisk' | 'userId' | 'fileNameInBucket'> & {
    projectId: TProjectId;
  }) {
    const file = await this.fileRepository.create(
      {
        data: {
          uri,
          fileNameOnDisk,
          userId,
          fileNameInBucket,
        },
        select: {
          id: true,
        },
      },
      projectId,
    );

    return file.id;
  }

  async getFileNameById({ id }: IFileIds, args: Prisma.FileFindFirstArgs, projectIds: TProjectIds) {
    return await this.fileRepository.findById({ id }, args || {}, projectIds);
  }
}
