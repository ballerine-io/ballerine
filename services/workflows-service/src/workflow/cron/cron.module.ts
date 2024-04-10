import { BusinessReportModule } from '@/business-report/business-report.module';
import { BusinessModule } from '@/business/business.module';
import { CustomerModule } from '@/customer/customer.module';
import { OngoingMonitoringCron } from '@/workflow/cron/ongoing-monitoring.cron';
import { WorkflowModule } from '@/workflow/workflow.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [WorkflowModule, BusinessModule, CustomerModule, BusinessReportModule],
  providers: [OngoingMonitoringCron],
})
export class CronModule {}
