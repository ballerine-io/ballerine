import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessReportControllerInternal } from '@/business-report/business-report.controller.internal';
import { HttpModule } from '@nestjs/axios';
// eslint-disable-next-line import/no-cycle
import { DataAnalyticsModule } from '@/data-analytics/data-analytics.module';
// eslint-disable-next-line import/no-cycle
import { WorkflowModule } from '@/workflow/workflow.module';
import { AlertModule } from '@/alert/alert.module';
// eslint-disable-next-line import/no-cycle
import { EndUserModule } from '@/end-user/end-user.module';
// eslint-disable-next-line import/no-cycle
import { BusinessModule } from '@/business/business.module';
import { CustomerModule } from '@/customer/customer.module';
import { MerchantMonitoringClient } from '@/business-report/merchant-monitoring-client';
import { BusinessReportControllerExternal } from '@/business-report/business-report.controller.external';

@Module({
  controllers: [BusinessReportControllerInternal, BusinessReportControllerExternal],
  imports: [
    forwardRef(() => WorkflowModule),
    forwardRef(() => EndUserModule),
    PrismaModule,
    ProjectModule,
    HttpModule,
    forwardRef(() => DataAnalyticsModule),
    forwardRef(() => AlertModule),
    BusinessModule,
    CustomerModule,
  ],
  providers: [BusinessReportService, MerchantMonitoringClient],
  exports: [BusinessReportService, MerchantMonitoringClient],
})
export class BusinessReportModule {}
