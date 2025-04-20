import { Global, Module } from '@nestjs/common';
import { AnalyticsService } from '@/common/analytics-logger/analytics.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
