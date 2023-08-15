import { Injectable } from '@nestjs/common';
import { EndUserRepository } from './end-user.repository';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class EndUserService {
  constructor(
    protected readonly repository: EndUserRepository,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<EndUserRepository['create']>[0]) {
    return await this.repository.create(args);
  }

  async list(args?: Parameters<EndUserRepository['findMany']>[0]) {
    return await this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<EndUserRepository['findById']>[1]) {
    return await this.repository.findById(id, args);
  }

  async createWithBusiness(endUser: EndUserCreateDto) {
    const { companyName = '', ...userData } = endUser;

    const user = await this.repository.create({
      data: {
        ...userData,
        businesses: {
          create: { companyName },
        },
      },
      include: {
        businesses: true,
      },
    });

    return user;
  }

  async getByEmail(email: string, projectIds: TProjectIds) {
    return await this.repository.find(
      this.scopeService.scopeFindOne(
        {
          where: {
            email,
          },
          include: {
            businesses: true,
          },
        },
        projectIds,
      ),
    );
  }
}
