import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import type { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { AnalyticsService, EventNamesMap } from '@/common/analytics-logger/analytics.service';

@Injectable()
export class UserService {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly analyticsService: AnalyticsService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<UserRepository['create']>[0], projectId: TProjectId) {
    const user = await this.userRepository.create(args, projectId);

    void this.analyticsService.trackSafe({
      event: EventNamesMap.USER_CREATED,
      distinctId: user.id,
      properties: {
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
      },
      customerId: user.customerId,
    });

    return user;
  }

  async list(args: Parameters<UserRepository['findMany']>[0], projectIds: TProjectIds) {
    return this.userRepository.findMany(args, projectIds);
  }

  async getById(
    id: string,
    args: Parameters<UserRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return this.userRepository.findById(id, args, projectIds);
  }

  async getByIdUnscoped(id: string, args: Parameters<UserRepository['findByIdUnscoped']>[1]) {
    return this.userRepository.findByIdUnscoped(id, args);
  }

  async getByEmailUnscoped(
    email: string,
    args?: Parameters<UserRepository['findByEmailUnscoped']>[1],
  ) {
    return this.userRepository.findByEmailUnscoped(email, args);
  }

  async updateById(id: string, args: Parameters<UserRepository['updateByIdUnscoped']>[1]) {
    return this.userRepository.updateByIdUnscoped(id, args);
  }

  async deleteById(
    id: string,
    args: Parameters<UserRepository['deleteById']>[1],
    projectIds?: TProjectIds,
  ) {
    return this.userRepository.deleteById(id, args, projectIds);
  }
}
