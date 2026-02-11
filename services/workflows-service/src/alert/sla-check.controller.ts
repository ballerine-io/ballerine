import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import type { Response } from 'express';

const SLA_BREACH_CROSS_ENV_KEY = 'SLA_BREACH_MANUAL_REVIEW';

/**
 * SLA Check Controller — Internal endpoint for periodic SLA breach detection.
 *
 * Designed to be triggered by an external scheduler (e.g., GCP Cloud Scheduler)
 * at a configurable interval (recommended: every 1 hour).
 *
 * Prerequisites:
 *   An AlertDefinition with crossEnvKey='SLA_BREACH_MANUAL_REVIEW' must exist
 *   in the database. Create one via the seed script or manually.
 *
 * Queries all workflows currently in `manual_review` state that have been
 * in that state longer than the SLA threshold (default: 24 hours).
 *
 * Creates `Alert` records for detected SLA breaches, with deduplication
 * to prevent duplicate alerts for the same workflow.
 *
 * Usage:
 *   Cloud Scheduler → POST /api/internal/sla-check
 *   (with X-API-KEY or admin auth header)
 */
@common.Controller('internal/sla-check')
@swagger.ApiExcludeController()
export class SlaCheckController {
  private readonly SLA_THRESHOLD_HOURS = parseInt(process.env['SLA_THRESHOLD_HOURS'] ?? '24', 10);

  constructor(private readonly prisma: PrismaService, private readonly logger: AppLoggerService) {}

  @common.Post()
  @common.UseGuards(AdminAuthGuard)
  async checkSla(@common.Res() response: Response): Promise<Response> {
    try {
      // Look up the SLA_BREACH AlertDefinition
      const alertDef = await this.prisma.alertDefinition.findUnique({
        where: { crossEnvKey: SLA_BREACH_CROSS_ENV_KEY },
      });

      if (!alertDef) {
        this.logger.warn(
          `SLA check skipped: AlertDefinition with crossEnvKey '${SLA_BREACH_CROSS_ENV_KEY}' not found. ` +
            `Create one via seed or manually.`,
        );

        return response.status(common.HttpStatus.OK).json({
          message: 'SLA check skipped — no AlertDefinition configured',
          hint: `Create an AlertDefinition with crossEnvKey='${SLA_BREACH_CROSS_ENV_KEY}'`,
        });
      }

      const thresholdDate = new Date();
      thresholdDate.setHours(thresholdDate.getHours() - this.SLA_THRESHOLD_HOURS);

      // Find workflows stuck in manual_review beyond SLA threshold
      const staleWorkflows = await this.prisma.workflowRuntimeData.findMany({
        where: {
          status: 'active',
          state: 'manual_review',
          projectId: alertDef.projectId,
          updatedAt: {
            lt: thresholdDate,
          },
        },
        select: {
          id: true,
          workflowDefinitionId: true,
          endUserId: true,
          businessId: true,
          assigneeId: true,
          projectId: true,
          state: true,
          createdAt: true,
          updatedAt: true,
        },
        take: 500,
        orderBy: { updatedAt: 'asc' }, // Process oldest-first for priority
      });

      if (staleWorkflows.length === 0) {
        return response.status(common.HttpStatus.OK).json({
          message: 'No SLA breaches detected',
          checked: 0,
          breaches: 0,
        });
      }

      this.logger.log(`SLA check: found ${staleWorkflows.length} stale workflows`, {
        threshold: `${this.SLA_THRESHOLD_HOURS}h`,
        count: staleWorkflows.length,
      });

      // Batch dedup: fetch all existing open alerts for these workflows in one query
      const existingAlerts = await this.prisma.alert.findMany({
        where: {
          alertDefinitionId: alertDef.id,
          workflowRuntimeDataId: { in: staleWorkflows.map(w => w.id) },
          state: { in: ['triggered', 'under_review'] },
        },
        select: { workflowRuntimeDataId: true },
      });

      const alreadyAlerted = new Set(
        existingAlerts.map(a => a.workflowRuntimeDataId).filter((id): id is string => id != null),
      );

      let created = 0;
      let skipped = 0;

      for (const workflow of staleWorkflows) {
        if (alreadyAlerted.has(workflow.id)) {
          skipped++;
          continue;
        }

        const hoursInReview = Math.round(
          (Date.now() - workflow.updatedAt.getTime()) / (1000 * 60 * 60),
        );

        await this.prisma.alert.create({
          data: {
            alertDefinitionId: alertDef.id,
            projectId: workflow.projectId,
            workflowRuntimeDataId: workflow.id,
            dataTimestamp: new Date(),
            state: 'triggered',
            status: 'new',
            severity: hoursInReview > this.SLA_THRESHOLD_HOURS * 2 ? 'high' : 'medium',
            executionDetails: {
              workflowDefinitionId: workflow.workflowDefinitionId,
              assigneeId: workflow.assigneeId,
              hoursInReview,
              slaThresholdHours: this.SLA_THRESHOLD_HOURS,
              type: 'SLA_BREACH',
            },
          },
        });
        created++;
      }

      this.logger.log(`SLA check complete`, { created, skipped, total: staleWorkflows.length });

      return response.status(common.HttpStatus.CREATED).json({
        message: `SLA check complete`,
        checked: staleWorkflows.length,
        breaches: created,
        skippedDuplicates: skipped,
      });
    } catch (error) {
      this.logger.error(`SLA check failed: ${error instanceof Error ? error.message : ''}`, {
        error,
      });

      throw new common.InternalServerErrorException('SLA check failed');
    }
  }
}
