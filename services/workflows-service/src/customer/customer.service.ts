import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/customer/customer.repository';
import { Prisma } from '@prisma/client';
import { TCustomerWithDefinitionsFeatures } from '@/customer/types';

@Injectable()
export class CustomerService {
  constructor(protected readonly repository: CustomerRepository) {}
  async create(args: Parameters<CustomerRepository['create']>[0]) {
    return (await this.repository.create(args)) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async list(args?: Parameters<CustomerRepository['findMany']>[0]) {
    return (await this.repository.findMany(args)) as unknown as TCustomerWithDefinitionsFeatures[];
  }

  async getById(id: string, args?: Parameters<CustomerRepository['findById']>[1]) {
    return (await this.repository.findById(
      id,
      args,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async getByApiKey(apiKey: string) {
    return (await this.repository.findByApiKey(
      apiKey,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async getByProjectId(projectId: string, args?: Omit<Prisma.CustomerFindFirstArgsBase, 'where'>) {
    return (await this.repository.findByProjectId(
      projectId,
      args,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async updateById(id: string, args: Parameters<CustomerRepository['updateById']>[1]) {
    return (await this.repository.updateById(
      id,
      args,
    )) as unknown as TCustomerWithDefinitionsFeatures;
  }

  async deleteById(id: string, args?: Parameters<CustomerRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }
}
