import { readReplicas } from '@prisma/extension-read-replicas';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { PrismaClient } from '@prisma/client';
import { env } from '@/env';

@Injectable()
export class ReadPrismaService extends PrismaService {
  readonly readClient = this.extendedClient.$extends(
    readReplicas({
      url: [env.READ_REPLICA_DATABASE_URL!],
    }),
  );

  constructor(protected readonly logger: AppLoggerService) {
    super(logger);
    Object.assign(this, this.readClient);
  }

  async onModuleInit() {
    await this.readClient.$connect();

    // @ts-ignore
    this.$on('query', (e: Prisma.QueryEvent) => {
      if (e && e.query) {
        this.logger.debug(`Read Replica Query: ${e.query}`);
      }
    });

    super.onModuleInit();
  }

  async onModuleDestroy() {
    await this.readClient.$disconnect();

    super.onModuleDestroy();
  }
}
