import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { DataMigrationRepository } from '@/data-migration/data-migration.repository';

@Module({
  imports: [PrismaModule],
  providers: [DataMigrationRepository],
})
export class DataMigrationModule {}
