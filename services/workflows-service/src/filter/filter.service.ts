import {Injectable, NotFoundException} from '@nestjs/common';
import { FilterRepository } from '@/filter/filter.repository';
import {NotFoundError} from "rxjs";

@Injectable()
export class FilterService {
  constructor(protected readonly repository: FilterRepository) {}

  async create(args: Parameters<FilterRepository['create']>[0]) {
    return await this.repository.create(args);
  }

  async list(args?: Parameters<FilterRepository['findMany']>[0]) {
    return await this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<FilterRepository['findById']>[1]) {
    const filter = await this.repository.findById(id, args);
    if (!filter) throw new NotFoundException(`No Filter with id [${id}] was found`);

    return filter;
  }
}
