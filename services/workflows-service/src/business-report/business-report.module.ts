import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessReportRepository } from '@/business-report/business-report.repository';
import { BusinessReportController } from '@/business-report/business-report.controller';

@Module({
  imports: [PrismaModule, ProjectModule],
  providers: [BusinessReportRepository, BusinessReportService],
  exports: [BusinessReportService],
  controllers: [BusinessReportController],
})
export class BusinessReportModule {}
