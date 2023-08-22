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

  async create(args: Parameters<UserRepository['create']>[0], projectIds?: TProjectIds) {
    return this.repository.create({
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
    });
  }

  async list(args?: Parameters<UserRepository['findMany']>[0], projectIds?: TProjectIds) {
    return this.repository.findMany({
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
    });
  }

  async getByIdUnscoped(id: string, args?: Parameters<UserRepository['findById']>[1]) {
    return this.repository.findById(id, args);
  }

  async getByEmailUnscoped(email: string, args?: Parameters<UserRepository['findByEmail']>[1]) {
    return this.repository.findByEmail(email, args);
  }

  async updateByIdUnscoped(id: string, args: Parameters<UserRepository['updateById']>[1]) {
    return this.repository.updateById(id, args);
  }

  async deleteById(id: string, args?: Parameters<UserRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }
}
