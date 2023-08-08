import { PrismaService } from '../prisma/prisma.service';
import {Customer, Prisma} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {CustomerWithProjectIds, CustomerWithProjects} from "@/types";

@Injectable()
export class CustomerRepository {
  constructor(
    protected readonly prisma: PrismaService,
  ) {}

  async create<T extends Prisma.CustomerCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CustomerCreateArgs>,
  ): Promise<Customer> {
    return this.prisma.customer.create<T>(args);
  }

  async findMany<T extends Prisma.CustomerFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.CustomerFindManyArgs>,
  ): Promise<Customer[]> {
    return this.prisma.customer.findMany(args);
  }

  async findById<T extends Omit<Prisma.CustomerFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.CustomerFindUniqueOrThrowArgs, 'where'>>,
  ): Promise<Customer> {
    return this.prisma.customer.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByName<T extends Omit<Prisma.CustomerFindUniqueArgs, 'where'>>(
    name: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.CustomerFindUniqueArgs, 'where'>>,
  ): Promise<any> {
    return this.prisma.customer.findUnique({
      where: { name },
      ...args,
    });
  }

  async findByApiKey<T extends Omit<Prisma.CustomerFindFirstArgs, 'where'>>(
    apiKey: string,
  ): Promise<CustomerWithProjects | null> {
    return this.prisma.customer.findFirst({
      where: {
        authenticationConfiguration: {
          equals: {
            authValue: apiKey
          },
        },
      },
      select: {
        id: true,
        name: true,
        authenticationConfiguration: true,
        displayName: true,
        logoImageUri: true,
        customerStatus: true,
        country: true,
        language: true,
        projects: true
      }
    });
  }

  async updateById<T extends Omit<Prisma.CustomerUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.CustomerUpdateArgs, 'where'>>,
  ): Promise<Customer> {
    return this.prisma.customer.update<T & { where: { id: string } }>({
      where: { id },
      ...args,
      data: {
        ...args.data,
      },
    });
  }

  async deleteById<T extends Omit<Prisma.CustomerDeleteArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.CustomerDeleteArgs, 'where'>>,
  ): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
      ...args,
    });
  }

  async queryRaw<TValue>(query: string, values: any[] = []): Promise<TValue> {
    return (await this.prisma.$queryRawUnsafe.apply(this.prisma, [query, ...values])) as TValue;
  }
}
