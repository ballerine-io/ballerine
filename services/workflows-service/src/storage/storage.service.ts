import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { Prisma } from '@prisma/client';

@Injectable()
export class StorageService {
  constructor(protected readonly fileRepository: FileRepository) {}

  async createFileLink({
    fileNameOnDisk,
    workflowId,
    userId,
  }: Pick<Prisma.FileCreateInput, 'fileNameOnDisk' | 'userId'> & {
    workflowId: string;
  }) {
    const file = await this.fileRepository.create({
      data: {
        fileNameOnDisk,
        userId,
        workflowRuntimeData: {
          connect: {
            id: workflowId,
          }
        }
      },
      select: {
        id: true,
      },
    });

    return file.id;
  }

  async listFileNames({ userId }: IFileIds) {
    return await this.fileRepository.findManyNames({
      userId,
    });
  }

  async getFileNameById({ id, userId }: IFileIds) {
    return await this.fileRepository.findNameById({
      id,
      userId,
    });
  }
}
