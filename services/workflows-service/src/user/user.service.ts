import { Injectable } from '@nestjs/common';
import { PasswordService } from '../auth/password/password.service';
import { UserRepository } from './user.repository';
import { TProjectIds } from '@/types';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly passwordService: PasswordService,
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
    return this.repository.findMany(
      {
        ...args,
        where: {
          ...args?.where,
          userToProjects: !args?.where?.userToProjects
            ? {
                every: {
                  projectId: {
                    in: projectIds!.map(projectId => projectId),
                  },
                },
              }
            : args.where.userToProjects,
        },
      },
      projectIds,
    );
  }

  async getByIdUnscoped(
    id: string,
    args: Parameters<UserRepository['findByIdUnscoped']>[1],
  ) {
    return this.repository.findByIdUnscoped(id, args);
  }

  async getByEmailUnscoped(
    email: string,
    args?: Parameters<UserRepository['findByEmailUnscoped']>[1],
  ) {
    return this.repository.findByEmailUnscoped(email, args);
  }

  async updateByIdUnscoped(
    id: string,
    args: Parameters<UserRepository['updateById']>[1],
    projectIds: TProjectIds,
  ) {
    return this.repository.updateById(id, args, projectIds);
  }

  async deleteById(
    id: string,
    args: Parameters<UserRepository['deleteById']>[1],
    projectIds: TProjectIds,
  ) {
    return this.repository.deleteById(id, args, projectIds);
  }
}
