import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { Prisma } from '@prisma/client';
import type { TProjectId, TProjectIds } from '@/types';

@Injectable()
export class StorageService {
  constructor(protected readonly fileRepository: FileRepository) {}

  async createFileLink({
    uri,
    fileNameOnDisk,
    fileName,
    userId,
    fileNameInBucket,
    projectId,
    mimeType,
  }: Pick<
    Prisma.FileCreateInput,
    'uri' | 'fileNameOnDisk' | 'userId' | 'fileNameInBucket' | 'mimeType' | 'fileName'
  > & {
    projectId: TProjectId;
  }) {
    const file = await this.fileRepository.create({
      data: {
        uri,
        fileNameOnDisk,
        fileName,
        userId,
        fileNameInBucket,
        mimeType,
        projectId,
      },
      select: {
        id: true,
        mimeType: true,
      },
    });

    return file;
  }

  async getFileById({ id }: IFileIds, projectIds: TProjectIds, args?: Prisma.FileFindFirstArgs) {
    return await this.fileRepository.findById({ id }, args || {}, projectIds);
  }
}
