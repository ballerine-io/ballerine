import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { BusinessReportService } from '@/business-report/business-report.service';

@Module({
  imports: [PrismaModule, ProjectModule],
  exports: [BusinessReportService],
})
export class BusinessReportModule {}
