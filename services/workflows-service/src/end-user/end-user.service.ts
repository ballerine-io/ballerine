import { Injectable } from '@nestjs/common';
import { EndUserRepository } from './end-user.repository';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { Business, EndUser } from '@prisma/client';

@Injectable()
export class EndUserService {
  constructor(
    protected readonly repository: EndUserRepository,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<EndUserRepository['create']>[0], projectIds: TProjectIds) {
    return await this.repository.create(args, projectIds);
  }

  async list(args: Parameters<EndUserRepository['findMany']>[0], projectIds: TProjectIds) {
    return await this.repository.findMany(args, projectIds);
  }

  async getById(id: string, args?: Parameters<EndUserRepository['findByIdUnscoped']>[1]) {
    return await this.repository.findByIdUnscoped(id, args);
  }

  async createWithBusiness(
    endUser: EndUserCreateDto,
    projectIds: TProjectIds,
  ): Promise<EndUser & { businesses: Business[] }> {
    const { companyName = '', ...userData } = endUser;

    const user = await this.repository.create(
      {
        data: {
          ...userData,
          projectId: projectIds?.at(-1),
          businesses: {
            create: { companyName, projectId: projectIds?.at(-1) },
          },
        },
        include: {
          businesses: true,
        },
      },
      projectIds,
    );

    return user as any;
  }

  async getByEmail(email: string, projectIds: TProjectIds) {
    return await this.repository.find(
      {
        where: {
          email,
        },
        include: {
          businesses: true,
        },
      },
      projectIds,
    );
  }
}
