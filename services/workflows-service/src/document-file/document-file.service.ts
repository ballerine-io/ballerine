import { Injectable } from '@nestjs/common';
import { DocumentFileRepository } from './document-file.repository';
import { Prisma } from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';

@Injectable()
export class DocumentFileService {
  constructor(protected readonly repository: DocumentFileRepository) {}

  async create(
    data: Prisma.DocumentFileUncheckedCreateInput,
    args?: Prisma.DocumentFileCreateArgs,
    transaction?: PrismaTransactionClient,
  ) {
    return await this.repository.create(data, args, transaction);
  }

  async createMany(
    data: Prisma.Enumerable<Prisma.DocumentFileCreateManyInput>,
    args?: Prisma.DocumentFileCreateManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    return await this.repository.createMany(data, args, transaction);
  }

  async getByDocumentId(
    documentId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileFindManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    return await this.repository.findByDocumentId(documentId, projectIds, args, transaction);
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentFileUpdateInput,
    args?: Prisma.DocumentFileUpdateArgs,
    transaction?: PrismaTransactionClient,
  ) {
    return await this.repository.updateById(id, projectIds, data, args, transaction);
  }

  async deleteById(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileDeleteArgs,
    transaction?: PrismaTransactionClient,
  ) {
    return await this.repository.deleteById(id, projectIds, args, transaction);
  }

  async deleteByDocumentId(
    documentId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileDeleteManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    return await this.repository.deleteByDocumentId(documentId, projectIds, args, transaction);
  }
}
