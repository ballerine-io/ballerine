import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessReportRepository } from '@/business-report/business-report.repository';

@Module({
  imports: [PrismaModule, ProjectModule],
  providers: [BusinessReportRepository, BusinessReportService],
  exports: [BusinessReportService],
})
export class BusinessReportModule {}
