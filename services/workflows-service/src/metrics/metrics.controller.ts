import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { NotFoundException } from '@/errors';
import { GetUserCasesResolvedDailyDto } from '@/metrics/dto/get-user-cases-resolved-daily.dto';
import { GetUserWorkflowProcessingStatisticDto } from '@/metrics/dto/get-user-workflow-processing-statistic.dto';
import { GetUsersAssignedCasesStatisticDto } from '@/metrics/dto/get-users-assigned-cases-statistic.dto';
import { GetUsersResolvedCasesStatisticDto } from '@/metrics/dto/get-users-resolved-cases-statistic.dto';
import { GetWorkflowRuntimesStatusCountDto } from '@/metrics/dto/get-workflow-runtimes-status-count.dto';
import { CasesResolvedInDay } from '@/metrics/repository/models/cases-resolved-daily.model';
import { MetricsUserModel } from '@/metrics/repository/models/metrics-user.model';
import { UserAssignedCasesStatisticModel } from '@/metrics/repository/models/user-assigned-cases-statistic.model';
import { UserResolvedCasesStatisticModel } from '@/metrics/repository/models/user-resolved-cases-statistic.model';
import { WorkflowDefinitionVariantsMetricModel } from '@/metrics/repository/models/workflow-definition-variants-metric.model';
import { WorkflowRuntimeStatisticModel } from '@/metrics/repository/models/workflow-runtime-statistic.model';
import { WorkflowRuntimeStatusCaseCountModel } from '@/metrics/repository/models/workflow-runtime-status-case-count.model';
import { MetricsService } from '@/metrics/service/metrics.service';
import { UserWorkflowProcessingStatisticModel } from '@/metrics/service/models/user-workflow-processing-statistic.model';
import type { TProjectId, TProjectIds } from '@/types';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Static, Type } from '@sinclair/typebox';
import { Validate } from 'ballerine-nestjs-typebox';
import { HomeMetricsSchema } from '@/metrics/schemas/home-metrics.schema';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@ApiTags('Metrics')
@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOkResponse({ type: [WorkflowRuntimeStatisticModel] })
  @common.HttpCode(200)
  @common.Get('/workflows/runtimes-statistic')
  async getRuntimesStatistic(
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeStatisticModel[]> {
    return await this.metricsService.listRuntimesStatistic(projectIds);
  }

  @ApiOkResponse({ type: WorkflowRuntimeStatusCaseCountModel })
  @common.HttpCode(200)
  @common.Get('/workflows/runtimes-status-count')
  async getRuntimesStatusCount(
    @common.Query() query: GetWorkflowRuntimesStatusCountDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeStatusCaseCountModel> {
    return await this.metricsService.getRuntimesStatusCaseCount(query, projectIds);
  }
  @ApiOkResponse({ type: [UserAssignedCasesStatisticModel] })
  @ApiNotFoundResponse({ type: NotFoundException })
  @common.HttpCode(200)
  @common.Get('/users/users-assigned-cases-statistic')
  async getUsersAssignedCasesStatistic(
    @ProjectIds() projectIds: TProjectIds,
    @common.Query() query: GetUsersAssignedCasesStatisticDto,
  ) {
    return await this.metricsService.listUsersAssignedCasesStatistic(query, projectIds);
  }

  @ApiOkResponse({ type: [UserResolvedCasesStatisticModel] })
  @ApiNotFoundResponse({ type: NotFoundException })
  @common.HttpCode(200)
  @common.Get('/users/users-resolved-cases-statistic')
  async getUsersResolvedCasesStatistic(
    @ProjectIds() projectIds: TProjectIds,
    @common.Query() query: GetUsersResolvedCasesStatisticDto,
  ) {
    return await this.metricsService.listUsersResolvedCasesStatistic(query, projectIds);
  }

  @ApiOkResponse({ type: UserWorkflowProcessingStatisticModel })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiNoContentResponse({ type: Object })
  @common.HttpCode(200)
  @common.Get('/users/workflow-processing-statistic')
  async getUserWorkflowProcessingStatistic(
    @common.Query() query: GetUserWorkflowProcessingStatisticDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<UserWorkflowProcessingStatisticModel> {
    return await this.metricsService.getUserWorkflowProcessingStatistic(
      {
        fromDate: query.fromDate,
      },
      projectIds,
    );
  }

  @ApiOkResponse({ type: [CasesResolvedInDay] })
  @common.HttpCode(200)
  @common.Get('/users/cases-resolved-daily')
  async getUserCasesResolvedDaily(
    @common.Query() query: GetUserCasesResolvedDailyDto,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<CasesResolvedInDay[]> {
    return await this.metricsService.listUserCasesResolvedDaily(
      {
        fromDate: query.fromDate,
        userId: query.userId,
      },
      projectIds,
    );
  }

  @ApiOkResponse({ type: [MetricsUserModel] })
  @common.HttpCode(200)
  @common.Get('/users')
  async getActiveUsers(@ProjectIds() projectIds: TProjectIds): Promise<MetricsUserModel[]> {
    return await this.metricsService.listActiveUsers(projectIds);
  }

  @ApiOkResponse({ type: [WorkflowDefinitionVariantsMetricModel] })
  @common.HttpCode(200)
  @common.Get('/workflow-definition/variants-metric')
  async getWorkflowDefinitionVariantsMetric(@ProjectIds() projectIds: TProjectIds) {
    return await this.metricsService.getWorkflowDefinitionVariantsMetric(projectIds);
  }

  @common.Get('home')
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: Type.Record(Type.String(), Type.Unknown()),
  })
  @Validate({
    response: HomeMetricsSchema,
  })
  async getHomeMetrics(@CurrentProject() currentProjectId: TProjectId) {
    return await this.metricsService.getHomeMetrics(currentProjectId);
  }
}
