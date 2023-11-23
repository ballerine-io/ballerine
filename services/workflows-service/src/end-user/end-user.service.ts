import { Injectable } from '@nestjs/common';
import { EndUserRepository } from './end-user.repository';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import type { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { Business, EndUser, Prisma } from '@prisma/client';

@Injectable()
export class EndUserService {
  constructor(
    protected readonly repository: EndUserRepository,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<EndUserRepository['create']>[0], projectId: TProjectId) {
    return await this.repository.create(args, projectId);
  }

  async list(args: Parameters<EndUserRepository['findMany']>[0], projectIds: TProjectIds) {
    return await this.repository.findMany(args, projectIds);
  }

  async getById(
    id: string,
    args: Parameters<EndUserRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.repository.findById(id, args, projectIds);
  }

  async createWithBusiness(
    endUser: EndUserCreateDto,
    projectId: TProjectId,
    businessId?: string,
  ): Promise<EndUser & { businesses: Business[] }> {
    const { companyName = '', ...userData } = endUser;

    const user = await this.repository.create(
      {
        data: {
          ...userData,
          businesses: {
            connectOrCreate: {
              where: {
                id: businessId,
              },
              create: { companyName, projectId: projectId },
            },
          },
        },
        include: {
          businesses: true,
        },
      },
      projectId,
    );

    return user as any;
  }

  async getByEmail(
    email: string,
    projectIds: TProjectIds,
  ): Promise<(EndUser & { businesses?: Business[] }) | null> {
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
  async updateById(
    id: string,
    endUser: Omit<Prisma.EndUserUpdateArgs, 'where'>,
    projectId: TProjectId,
  ) {
    return await this.repository.updateById(id, endUser, projectId);
  }
}
