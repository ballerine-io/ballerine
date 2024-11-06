import { PrismaService } from '@/prisma/prisma.service';
import { Note, Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from '@/types';

const defaultFieldsSelect = {
  id: true,
  entityId: true,
  entityType: true,
  noteableId: true,
  noteableType: true,
  content: true,
  fileIds: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
} satisfies Prisma.NoteSelect;

const defaultArgs = {
  select: {
    ...defaultFieldsSelect,
    parentNote: { select: defaultFieldsSelect },
    childrenNotes: { select: defaultFieldsSelect },
  },
  orderBy: {
    createdAt: 'desc',
  },
} satisfies Prisma.NoteFindManyArgs;

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
      include: {
        parentNote: { select: defaultFieldsSelect },
        childrenNotes: { select: defaultFieldsSelect },
      },
    });
  }

  async findMany<T extends Prisma.NoteFindManyArgs>(
    projectId: string,
    args?: Prisma.SelectSubset<T, Prisma.NoteFindManyArgs>,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ) {
    return transaction.note.findMany({
      where: { ...(args?.where || {}), deletedAt: null, projectId },
      select: { ...(args?.select || defaultArgs.select) },
      orderBy: { ...(args?.orderBy || defaultArgs?.orderBy) },
    });
  }

  async findById(
    id: string,
    projectId: string,
    args?: Omit<Prisma.NoteFindFirstOrThrowArgs, 'where'>,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ) {
    return transaction.note.findFirstOrThrow({
      select: {
        ...(args?.select || defaultArgs.select),
      },
      where: { id, deletedAt: null, projectId },
    });
  }

  async findByProjectId<T extends Omit<Prisma.NoteFindManyArgs, 'where'>>(
    projectId: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.NoteFindManyArgs, 'where'>>,
  ) {
    return this.prismaService.note.findMany({
      where: { deletedAt: null, projectId },
      select: { ...(args?.select || defaultArgs.select) },
      orderBy: { ...(args?.orderBy || defaultArgs?.orderBy) },
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
