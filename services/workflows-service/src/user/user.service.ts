import { Injectable } from '@nestjs/common';
import { PasswordService } from '../auth/password/password.service';
import { UserRepository } from './user.repository';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly passwordService: PasswordService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<UserRepository['create']>[0], projectIds: TProjectIds) {
    return await this.repository.create(
      {
        ...args,
        data: {
          ...args?.data,
          userToProjects: !args?.data?.userToProjects
            ? {
                createMany: {
                  data: projectIds
                    ? projectIds.map(projectId => {
                        return { projectId };
                      })
                    : [],
                },
              }
            : args.data.userToProjects,
        },
      },
      projectIds,
    );
  }

  async list(args: Parameters<UserRepository['findMany']>[0], projectIds: TProjectIds) {
    return this.repository.findMany(args, projectIds);
  }

  async getById(
    id: string,
    args: Parameters<UserRepository['findById']>[1],
    projectIds?: TProjectIds,
  ) {
    return this.repository.findById(id, args, projectIds);
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
    projectIds: TProjectIds,
  ) {
    return this.repository.deleteById(id, args, projectIds);
  }
}
