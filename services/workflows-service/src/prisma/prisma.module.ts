import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PRISMA_READ_SERVICE, PRISMA_SERVICE } from './consts';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ReadPrismaService } from './prisma.read-replica.service';
import { env } from '@/env';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PRISMA_READ_SERVICE,
      useClass: Boolean(env.READ_REPLICA_DATABASE_URL) ? ReadPrismaService : PrismaService,
      inject: [AppLoggerService],
      useFactory(logger: AppLoggerService): PrismaService {
        return new ReadPrismaService(logger);
      },
    },
  ].filter(Boolean),
  exports: [PRISMA_READ_SERVICE, PrismaService],
})
export class PrismaModule {}
