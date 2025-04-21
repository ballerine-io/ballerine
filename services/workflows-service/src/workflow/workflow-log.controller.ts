import { Controller, Get, Param, Query, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { WorkflowLogRepository } from './workflow-log.repository';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds } from '@/types';
import { WorkflowLogType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

class GetWorkflowLogsQueryDto {
  @IsOptional()
  @IsEnum(WorkflowLogType, { each: true })
  types?: WorkflowLogType[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize?: number = 50;

  @IsOptional()
  @IsString()
  orderBy?: 'asc' | 'desc' = 'desc';
}

@ApiTags('workflow-logs')
@Controller('workflow-logs')
export class WorkflowLogController {
  constructor(private readonly workflowLogRepository: WorkflowLogRepository) {}

  @Get(':workflowId')
  @ApiOperation({ summary: 'Get logs for a specific workflow' })
  @ApiResponse({
    status: 200,
    description: 'Return logs for a workflow',
  })
  async getWorkflowLogs(
    @Param('workflowId') workflowId: string,
    @Query(new ValidationPipe({ transform: true })) query: GetWorkflowLogsQueryDto,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const { logs, total } = await this.workflowLogRepository.findLogsByWorkflowId(
      workflowId,
      query,
      projectIds,
    );

    return {
      data: logs,
      meta: {
        total,
        page: query.page,
        pageSize: query.pageSize,
      },
    };
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all available log types' })
  @ApiResponse({
    status: 200,
    description: 'Return all log types',
  })
  getLogTypes() {
    return {
      data: Object.values(WorkflowLogType),
    };
  }

  @Get('summary/:workflowId')
  @ApiOperation({ summary: 'Get a summary of logs for a workflow' })
  @ApiResponse({
    status: 200,
    description: 'Return a summary of logs for a workflow',
  })
  async getWorkflowLogSummary(
    @Param('workflowId', ParseUUIDPipe) workflowId: string,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const summary = await this.workflowLogRepository.getLogSummary(workflowId, projectIds);

    return {
      data: summary,
    };
  }
}
