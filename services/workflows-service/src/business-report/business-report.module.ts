import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessReportRepository } from '@/business-report/business-report.repository';
import { BusinessReportControllerInternal } from '@/business-report/business-report.controller.internal';

@Module({
  controllers: [BusinessReportControllerInternal],
  imports: [PrismaModule, ProjectModule],
  providers: [BusinessReportRepository, BusinessReportService],
  exports: [BusinessReportService],
})
export class BusinessReportModule {}
