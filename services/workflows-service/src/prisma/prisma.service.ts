import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { Prisma, PrismaClient } from '@prisma/client';

const prismaExtendedClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    model: {
      $allModels: {
        async exists<M>(this: M, where: Prisma.Args<M, 'findFirst'>['where']): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);
          const result = await (context as any).findFirst({ where });

          return result !== null;
        },
        async softDelete<M, A>(
          this: M,
          where: Prisma.Args<M, 'update'>['where'],
        ): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).update({
            where,
            data: {
              deletedAt: new Date(),
            },
          });
        },
      },
    },
  });

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  readonly extendedClient = prismaExtendedClient(this);

  constructor(protected readonly logger: AppLoggerService) {
    super({
      errorFormat: 'pretty',
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    // This is a workaround for the issue with BigInt serialization in Prisma
    // https://stackoverflow.com/questions/75947475/prisma-typeerror-do-not-know-how-to-serialize-a-bigint
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
  }

  async onModuleInit() {
    await this.$connect();

    // @ts-ignore
    this.$on('query', (e: Prisma.QueryEvent) => {
      if (e && e.query) {
        this.logger.debug(`Query: ${e.query}`);
      }
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
