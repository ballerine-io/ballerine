import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
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
    this.$on('query', e => {
      // @ts-ignore
      this.logger.debug('Query: ' + e.query);
    });
  }

  enableShutdownHooks(app: INestApplication): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.$on('beforeExit', () => {
        app.close().then(resolve).catch(reject);
      });
    });
  }
}
