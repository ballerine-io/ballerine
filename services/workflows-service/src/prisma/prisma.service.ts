import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
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
