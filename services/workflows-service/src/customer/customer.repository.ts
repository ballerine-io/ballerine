import { PrismaService } from '@/prisma/prisma.service';
import { Customer, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CustomerWithProjects } from '@/types';

@Injectable()
export class CustomerRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.CustomerCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CustomerCreateArgs>,
  ): Promise<Customer> {
    // @ts-expect-error - prisma json not updated
    await this.validateApiKey(args.data?.authenticationConfiguration?.authValue);

    return this.prisma.customer.create<T>(args);
  }

  async validateApiKey(apiKey?: string) {
    if (apiKey === undefined) return;

    if (apiKey.length < 4) throw new Error('Invalid API key');

    const customerApiAlreadyExists = await this.findByApiKey(apiKey);

    if (customerApiAlreadyExists) throw new Error('API key already exists');
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

  async findByProjectId<T extends Omit<Prisma.CustomerFindFirstArgsBase, 'where'>>(
    projectId: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.CustomerFindFirstArgsBase, 'where'>>,
  ): Promise<Customer> {
    return this.prisma.customer.findFirstOrThrow({
      where: { projects: { some: { id: projectId } } },
      ...(args || {
        select: {
          id: true,
          name: true,
          displayName: true,
          logoImageUri: true,
          faviconImageUri: true,
          country: true,
          language: true,
          websiteUrl: true,
          projects: true,
          subscriptions: true,
        },
      }),
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
          path: ['authValue'],
          equals: apiKey,
        },
      },
      select: {
        id: true,
        name: true,
        authenticationConfiguration: true,
        displayName: true,
        logoImageUri: true,
        faviconImageUri: true,
        customerStatus: true,
        country: true,
        language: true,
        projects: true,
      },
    });
  }

  async updateById<T extends Omit<Prisma.CustomerUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.CustomerUpdateArgs, 'where'>>,
  ): Promise<Customer> {
    // @ts-expect-error - prisma json not updated
    await this.validateApiKey(args.data?.authenticationConfiguration?.authValue);

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
}
