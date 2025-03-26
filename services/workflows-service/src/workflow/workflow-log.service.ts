import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { env } from '../env';
import { PrismaTransaction } from '@/types';

export const WorkflowLogType = {
  EVENT_RECEIVED: 'EVENT_RECEIVED',
  STATE_TRANSITION: 'STATE_TRANSITION',
  PLUGIN_INVOCATION: 'PLUGIN_INVOCATION',
  CONTEXT_CHANGED: 'CONTEXT_CHANGED',
  ERROR: 'ERROR',
  INFO: 'INFO',
} as const;

export type WorkflowLogType = (typeof WorkflowLogType)[keyof typeof WorkflowLogType];

interface WorkflowLogEntry {
  workflowRuntimeDataId: string;
  type: WorkflowLogType;
  fromState?: string;
  toState?: string;
  message?: string;
  metadata?: Record<string, any>;
  projectId: string;
}

export interface WorkflowRunnerLogEntry {
  category: string;
  level: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  previousState?: string;
  newState?: string;
  eventName?: string;
  pluginName?: string;
}

@Injectable()
export class WorkflowLogService {
  private readonly logger = new Logger(WorkflowLogService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async processWorkflowRunnerLogs(
    workflowRuntimeDataId: string,
    projectId: string,
    logs: WorkflowRunnerLogEntry[],
    transaction?: PrismaTransaction,
  ): Promise<void> {
    this.logger.log('Processing workflow runner logs', {
      workflowRuntimeDataId,
      projectId,
      logs,
    });

    if (!env.WORKFLOW_LOGGING_ENABLED || !logs || logs.length === 0) {
      return;
    }

    try {
      const formattedLogs = logs.map(log => ({
        workflowRuntimeDataId,
        type: log.category as WorkflowLogType,
        fromState: log.previousState,
        toState: log.newState,
        message: log.message,
        metadata: log.metadata,
        eventName: log.eventName,
        pluginName: log.pluginName,
        projectId,
      }));

      const prismaClient = transaction || this.prismaService;

      for (const log of formattedLogs) {
        await prismaClient.workflowLog.create({
          data: {
            workflowRuntimeDataId: log.workflowRuntimeDataId,
            type: log.type,
            fromState: log.fromState,
            toState: log.toState,
            message: log.message,
            metadata: log.metadata || {},
            projectId: log.projectId,
            eventName: log.eventName,
            pluginName: log.pluginName,
          },
        });
      }

      this.logger.debug(
        `Persisted ${formattedLogs.length} log entries for workflow ${workflowRuntimeDataId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process logs for workflow ${workflowRuntimeDataId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
