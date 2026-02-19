import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Cron job that detects and alerts on workflows stuck in PENDING_PROCESS states.
 *
 * Workflows waiting for external callbacks (document_verification, facial_verification,
 * pending_kyc, etc.) can wait indefinitely if the callback never arrives.
 * This job finds workflows that have been in a PENDING_PROCESS-tagged state
 * for longer than the configured threshold and logs alerts for operator action.
 *
 * Future enhancement: automatically transition stuck workflows to manual_review.
 */
@Injectable()
export class StuckWorkflowCron {
  private readonly logger = new Logger(StuckWorkflowCron.name);

  /** Hours after which a PENDING_PROCESS workflow is considered stuck */
  private readonly stuckThresholdHours = Number(
    process.env['STUCK_WORKFLOW_THRESHOLD_HOURS'] || '6',
  );

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async detectStuckWorkflows() {
    try {
      const thresholdDate = new Date();
      thresholdDate.setHours(thresholdDate.getHours() - this.stuckThresholdHours);

      // Find workflow runtime data entries that haven't been updated
      // since the threshold and are not in a terminal state.
      const terminalStates = ['approved', 'rejected', 'manual_review', 'revision', 'resolved'];

      const stuckWorkflows = await this.prisma.workflowRuntimeData.findMany({
        where: {
          updatedAt: { lt: thresholdDate },
          status: 'active',
          state: { notIn: terminalStates },
        },
        select: {
          id: true,
          state: true,
          updatedAt: true,
          workflowDefinitionId: true,
          context: true,
        },
        take: 100,
      });

      if (stuckWorkflows.length === 0) {
        this.logger.debug('No stuck workflows found');
        return;
      }

      this.logger.warn(
        `Found ${stuckWorkflows.length} workflow(s) stuck in PENDING_PROCESS states for >${this.stuckThresholdHours}h`,
      );

      for (const wf of stuckWorkflows) {
        const hoursSinceUpdate = Math.round(
          (Date.now() - new Date(wf.updatedAt).getTime()) / (1000 * 60 * 60),
        );

        this.logger.warn(
          {
            workflowId: wf.id,
            state: wf.state,
            definitionId: wf.workflowDefinitionId,
            hoursSinceUpdate,
            updatedAt: wf.updatedAt,
          },
          `Stuck workflow: ${wf.id} in state "${wf.state}" for ${hoursSinceUpdate}h (definition: ${wf.workflowDefinitionId})`,
        );
      }
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Failed to check for stuck workflows',
      );
    }
  }
}
