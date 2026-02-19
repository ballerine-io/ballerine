import { Module } from '@nestjs/common';
import { StuckWorkflowCron } from './stuck-workflow.cron';

@Module({
  imports: [],
  providers: [StuckWorkflowCron],
})
export class CronModule {}
