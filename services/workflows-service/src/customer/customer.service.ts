import { Injectable } from '@nestjs/common';
import {CustomerRepository} from "@/customer/customer.repository";

@Injectable()
export class CustomerService {
  constructor(
    protected readonly repository: CustomerRepository,
  ) {}

  async create(args: Parameters<CustomerRepository['create']>[0]) {
    return this.repository.create(args);
  }

  async list(args?: Parameters<CustomerRepository['findMany']>[0]) {
    return this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<CustomerRepository['findById']>[1]) {
    return this.repository.findById(id, args);
  }

  async getByApiKey(apiKey: string) {
    return this.repository.findByApiKey(apiKey);
  }

  async updateById(id: string, args: Parameters<CustomerRepository['updateById']>[1]) {
    return this.repository.updateById(id, args);
  }

  async deleteById(id: string, args?: Parameters<CustomerRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }
}
