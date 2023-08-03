import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.$on('beforeExit', () => {
        app.close().then(resolve).catch(reject);
      });
    });
  }
}
