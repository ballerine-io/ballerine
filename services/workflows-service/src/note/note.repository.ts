import { PrismaService } from '@/prisma/prisma.service';
import { Note, Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@/types';

@Injectable()
export class NoteRepository {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(
    data: Omit<Prisma.NoteUncheckedCreateInput, 'projectId'>,
    projectId: string,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ): Promise<Note> {
    return transaction.note.create({
      data: { ...data, projectId },
    });
  }

  async findMany<T extends Prisma.NoteFindManyArgs>(
    projectId: string,
    args?: Prisma.SelectSubset<T, Prisma.NoteFindManyArgs>,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ) {
    return transaction.note.findMany({
      select: {
        ...(args?.select || {
          id: true,
          entityId: true,
          entityType: true,
          noteableId: true,
          noteableType: true,
          content: true,
          parentNote: true,
          fileIds: true,
          createdAt: true,
          updatedAt: true,
          childrenNotes: true,
        }),
      },
      where: { ...(args?.where || {}), deletedAt: null, projectId },
    });
  }

  async findById(
    id: string,
    projectId: string,
    args?: Omit<Prisma.NoteFindManyArgs, 'where'>,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ): Promise<Note> {
    return transaction.note.findFirstOrThrow({
      ...args,
      where: { id, deletedAt: null, projectId },
    });
  }

  async findByProjectId<T extends Omit<Prisma.NoteFindManyArgs, 'where'>>(
    projectId: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.NoteFindManyArgs, 'where'>>,
  ) {
    return this.prismaService.note.findMany({
      where: { project: { id: projectId } },
      ...(args || {
        select: {
          id: true,
          entityId: true,
          entityType: true,
          noteableId: true,
          noteableType: true,
          content: true,
          parentNote: true,
          fileIds: true,
          createdAt: true,
          updatedAt: true,
          childrenNotes: true,
        },
      }),
    });
  }

  async updateById<T extends Omit<Prisma.NoteUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.NoteUpdateArgs, 'where'>>,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ): Promise<Note> {
    return transaction.note.update({
      where: { id },
      data: { ...args.data },
    });
  }

  async deleteById(
    id: string,
    projectId: string,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ): Promise<Note> {
    return transaction.note.update({
      where: { id },
      data: { deletedAt: new Date(), projectId },
    });
  }
}
