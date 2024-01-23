import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import type { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<UserRepository['create']>[0], projectId: TProjectId) {
    return await this.repository.create(args, projectId);
  }

  async list(args: Parameters<UserRepository['findMany']>[0], projectIds: TProjectIds) {
    return this.repository.findMany(args, projectIds);
  }

  async getById(
    id: string,
    args: Parameters<UserRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return this.repository.findById(id, args, projectIds);
  }

  async getByIdUnscoped(id: string, args: Parameters<UserRepository['findByIdUnscoped']>[1]) {
    return this.repository.findByIdUnscoped(id, args);
  }

  async getByEmailUnscoped(
    email: string,
    args?: Parameters<UserRepository['findByEmailUnscoped']>[1],
  ) {
    return this.repository.findByEmailUnscoped(email, args);
  }

  async updateById(id: string, args: Parameters<UserRepository['updateByIdUnscoped']>[1]) {
    return this.repository.updateByIdUnscoped(id, args);
  }

  async deleteById(
    id: string,
    args: Parameters<UserRepository['deleteById']>[1],
    projectIds?: TProjectIds,
  ) {
    return this.repository.deleteById(id, args, projectIds);
  }
}
