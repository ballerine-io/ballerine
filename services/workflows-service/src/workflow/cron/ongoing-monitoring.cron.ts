import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ONGOING_MONITORING_LOCK_KEY } from '@/workflow/cron/lock-keys';
import { isErrorWithMessage } from '@ballerine/common';
import { WorkflowService } from '@/workflow/workflow.service';

@Injectable()
export class OngoingMonitoringCron {
  private readonly lockKey = ONGOING_MONITORING_LOCK_KEY;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly workflowService: WorkflowService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const lockAcquired = await this.prisma.acquireLock(this.lockKey);

    if (!lockAcquired) {
      this.logger.warn('Lock not acquired, another instance might be running the job.');

      return;
    }

    try {
      const workflowRuntimes = await this.workflowService.getWorkflowsByState(
        ['pending-ongoing-monitoring'],
        {},
      );
    } catch (error) {
      this.logger.error(`An error occurred: ${isErrorWithMessage(error) && error.message}`);
    } finally {
      await this.prisma.releaseLock(this.lockKey);
    }
  }
}
