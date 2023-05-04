import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { Prisma } from '@prisma/client';

@Injectable()
export class StorageService {
  constructor(protected readonly fileRepository: FileRepository) {}

  async createFileLink({
    uri,
    fileNameOnDisk,
    userId,
    bucketKey,
  }: Pick<Prisma.FileCreateInput, 'uri' | 'fileNameOnDisk' | 'userId' | 'bucketKey'>) {
    const file = await this.fileRepository.create({
      data: {
        uri,
        fileNameOnDisk,
        userId,
        bucketKey,
      },
      select: {
        id: true,
      },
    });

    return file.id;
  }

  async getFileNameById({ id, userId }: IFileIds) {
    return await this.fileRepository.findNameById({
      id,
      userId,
    });
  }
}
