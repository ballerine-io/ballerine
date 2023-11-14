import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { Prisma } from '@prisma/client';
import type { TProjectId, TProjectIds } from '@/types';
import { SetOptional } from 'type-fest';

@Injectable()
export class StorageService {
  constructor(protected readonly fileRepository: FileRepository) {}

  async createFileLink({
    uri,
    fileNameOnDisk,
    userId,
    fileNameInBucket,
    projectId,
    mimeType,
  }: Pick<
    Prisma.FileCreateInput,
    'uri' | 'fileNameOnDisk' | 'userId' | 'fileNameInBucket' | 'mimeType'
  > & {
    projectId: TProjectId;
  }) {
    const file = await this.fileRepository.create(
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
          mimeType: true,
        },
      },
      projectId,
    );

    return file;
  }

  async getFileById({ id }: IFileIds, projectIds: TProjectIds, args?: Prisma.FileFindFirstArgs) {
    return await this.fileRepository.findById({ id }, args || {}, projectIds);
  }
}
