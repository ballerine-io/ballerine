import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import {Prisma} from '@prisma/client';

@Injectable()
export class StorageService {
  constructor(protected readonly fileRepository: FileRepository) {}

  async createFileLink({fileNameOnDisk, userId}: Pick<Prisma.FileCreateInput, 'fileNameOnDisk' | 'userId'>) {
    const file = await this.fileRepository.create({
      data: {
        fileNameOnDisk,
        userId,
      },
      select: {
        id: true,
      },
    });

    return file.id;
  }

  async getFileNameById({id, userId}: IFileIds) {
    return await this.fileRepository.findNameById({
      id,
      userId,
    });
  }
}
