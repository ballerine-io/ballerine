import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { NoteRepository } from '@/note/note.repository';

@Injectable()
export class NoteService {
  constructor(protected readonly noteRepository: NoteRepository) {}
  async create(args: Parameters<NoteRepository['create']>[0], projectId: string) {
    return await this.noteRepository.create(args, projectId);
  }

  async list(projectId: string, args?: Parameters<NoteRepository['findMany']>[1]) {
    return await this.noteRepository.findMany(projectId, args);
  }

  async getById(id: string, projectId: string, args?: Parameters<NoteRepository['findById']>[2]) {
    return await this.noteRepository.findById(id, projectId, args);
  }

  async getByProjectId(projectId: string, args?: Omit<Prisma.NoteFindFirstArgsBase, 'where'>) {
    return await this.noteRepository.findByProjectId(projectId, args);
  }

  async updateById(id: string, args: Parameters<NoteRepository['updateById']>[1]) {
    return await this.noteRepository.updateById(id, args);
  }

  async deleteById(
    id: string,
    projectId: string,
    args?: Parameters<NoteRepository['deleteById']>[2],
  ) {
    await this.noteRepository.deleteById(id, projectId, args);
  }
}
