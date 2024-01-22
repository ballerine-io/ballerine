import { PrismaService } from '../prisma/prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { TransactionWithProjects } from '@/types';

@Injectable()
export class TransactionRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.TransactionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TransactionCreateArgs>,
  ): Promise<Transaction> {
    // @ts-expect-error - prisma json not updated
    await this.validateApiKey(args.data?.authenticationConfiguration?.authValue);

    return this.prisma.transaction.create<T>(args);
  }

  async validateApiKey(apiKey?: string) {
    if (apiKey === undefined) return;

    if (apiKey.length < 4) throw new Error('Invalid API key');

    const transactionApiAlreadyExists = await this.findByApiKey(apiKey);
    if (transactionApiAlreadyExists) throw new Error('API key already exists');
  }

  async findMany<T extends Prisma.TransactionFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.TransactionFindManyArgs>,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany(args);
  }

  async findById<T extends Omit<Prisma.TransactionFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.TransactionFindUniqueOrThrowArgs, 'where'>>,
  ): Promise<Transaction> {
    return this.prisma.transaction.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByProjectId<T extends Omit<Prisma.TransactionFindFirstArgsBase, 'where'>>(
    projectId: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.TransactionFindFirstArgsBase, 'where'>>,
  ): Promise<Transaction> {
    return this.prisma.transaction.findFirstOrThrow({
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
        },
      }),
    });
  }

  async findByName<T extends Omit<Prisma.TransactionFindUniqueArgs, 'where'>>(
    name: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.TransactionFindUniqueArgs, 'where'>>,
  ): Promise<any> {
    return this.prisma.transaction.findUnique({
      where: { name },
      ...args,
    });
  }

  async findByApiKey<T extends Omit<Prisma.TransactionFindFirstArgs, 'where'>>(
    apiKey: string,
  ): Promise<TransactionWithProjects | null> {
    return this.prisma.transaction.findFirst({
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
        transactionStatus: true,
        country: true,
        language: true,
        projects: true,
      },
    });
  }

  async updateById<T extends Omit<Prisma.TransactionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.TransactionUpdateArgs, 'where'>>,
  ): Promise<Transaction> {
    // @ts-expect-error - prisma json not updated
    await this.validateApiKey(args.data?.authenticationConfiguration?.authValue);

    return this.prisma.transaction.update<T & { where: { id: string } }>({
      where: { id },
      ...args,
      data: {
        ...args.data,
      },
    });
  }

  async deleteById<T extends Omit<Prisma.TransactionDeleteArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.TransactionDeleteArgs, 'where'>>,
  ): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
      ...args,
    });
  }
}
