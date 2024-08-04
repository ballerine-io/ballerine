import { FilterRepository } from '@/filter/filter.repository';
import type { TProjectId, TProjectIds } from '@/types';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FilterService {
  constructor(protected readonly repository: FilterRepository) {}

  async create(args: Parameters<FilterRepository['create']>[0], projectId: TProjectId) {
    return await this.repository.create(args, projectId);
  }

  async list(args: Parameters<FilterRepository['findMany']>[0], projectIds: TProjectIds) {
    return await this.repository.findMany(args, projectIds);
  }

  async count(args: Parameters<FilterRepository['count']>[0], projectIds: TProjectIds) {
    return await this.repository.count(args, projectIds);
  }

  async getById(
    id: string,
    args: Parameters<FilterRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    const filter = await this.repository.findById(id, args, projectIds);

    if (!filter) {
      throw new NotFoundException(`No Filter with id [${id}] was found`);
    }

    return filter;
  }

  async updatedById(id: string, args: Parameters<FilterRepository['updateById']>[1]) {
    return await this.repository.updateById(id, args);
  }
}
