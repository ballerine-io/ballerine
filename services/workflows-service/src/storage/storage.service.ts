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
    fileNameInBucket,
  }: Pick<Prisma.FileCreateInput, 'uri' | 'fileNameOnDisk' | 'userId' | 'fileNameInBucket'>) {
    const file = await this.fileRepository.create({
      data: {
        uri,
        fileNameOnDisk,
        userId,
        fileNameInBucket,
      },
      select: {
        id: true,
      },
    });

    return file.id;
  }

  async getFileNameById({ id }: IFileIds) {
    return await this.fileRepository.findById({ id });
  }
}
