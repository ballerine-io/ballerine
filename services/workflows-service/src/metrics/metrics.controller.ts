import { NotFoundException } from '@/errors';
import { GetActiveUsersDto } from '@/metrics/dto/get-active-users.dto';
import { GetUserCasesResolvedDailyDto } from '@/metrics/dto/get-user-cases-resolved-daily.dto';
import { GetUserWorkflowProcessingStatisticDto } from '@/metrics/dto/get-user-workflow-processing-statistic.dto';
import { GetUsersAssignedCasesStatisticDto } from '@/metrics/dto/get-users-assigned-cases-statistic.dto';
import { GetUsersResolvedCasesStatisticDto } from '@/metrics/dto/get-users-resolved-cases-statistic.dto';
import { GetWorkflowRuntimesStatusCountDto } from '@/metrics/dto/get-workflow-runtimes-status-count.dto';
import { ActiveUserModel } from '@/metrics/repository/models/active-user.model';
import { UserAssignedCasesStatisticModel } from '@/metrics/repository/models/user-assigned-cases-statistic.model';
import { UserCasesResolvedInDay } from '@/metrics/repository/models/user-cases-resolved-daily.model';
import { UserResolvedCasesStatisticModel } from '@/metrics/repository/models/user-resolved-cases-statistic.model';
import { WorkflowRuntimeStatisticModel } from '@/metrics/repository/models/workflow-runtime-statistic.model';
import { WorkflowRuntimeStatusCaseCountModel } from '@/metrics/repository/models/workflow-runtime-status-case-count.model';
import { MetricsService } from '@/metrics/service/metrics.service';
import { UserWorkflowProcessingStatisticModel } from '@/metrics/service/models/user-workflow-processing-statistic.model';
import * as common from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOkResponse({ type: [WorkflowRuntimeStatisticModel] })
  @common.HttpCode(200)
  @common.Get('/workflows/runtimes-statistic')
  async getRuntimesStatistic(): Promise<WorkflowRuntimeStatisticModel[]> {
    return await this.metricsService.listRuntimesStatistic();
  }

  @ApiOkResponse({ type: WorkflowRuntimeStatusCaseCountModel })
  @common.HttpCode(200)
  @common.Get('/workflows/runtimes-status-count')
  async getRuntimesStatusCount(
    @common.Query() query: GetWorkflowRuntimesStatusCountDto,
  ): Promise<WorkflowRuntimeStatusCaseCountModel> {
    return await this.metricsService.getRuntimesStatusCaseCount(query);
  }
  @ApiOkResponse({ type: [UserAssignedCasesStatisticModel] })
  @ApiNotFoundResponse({ type: NotFoundException })
  @common.HttpCode(200)
  @common.Get('/users/users-assigned-cases-statistic')
  async getUsersAssignedCasesStatistic(@common.Query() query: GetUsersAssignedCasesStatisticDto) {
    return await this.metricsService.listUsersAssignedCasesStatistic(query);
  }

  @ApiOkResponse({ type: [UserResolvedCasesStatisticModel] })
  @ApiNotFoundResponse({ type: NotFoundException })
  @common.HttpCode(200)
  @common.Get('/users/users-resolved-cases-statistic')
  async getUsersResolvedCasesStatistic(@common.Query() query: GetUsersResolvedCasesStatisticDto) {
    return await this.metricsService.listUsersResolvedCasesStatistic(query);
  }

  @ApiOkResponse({ type: UserWorkflowProcessingStatisticModel })
  @ApiNotFoundResponse({ type: NotFoundException })
  @ApiNoContentResponse({ type: Object })
  @common.HttpCode(200)
  @common.Get('/users/:userId/user-workflow-processing-statistic')
  async getUserWorkflowProcessingStatistic(
    @common.Param('userId') userId: string,
    @common.Query() query: GetUserWorkflowProcessingStatisticDto,
  ): Promise<UserWorkflowProcessingStatisticModel> {
    return await this.metricsService.getUserWorkflowProcessingStatistic({
      fromDate: query.fromDate,
      userId,
    });
  }

  @ApiOkResponse({ type: [UserCasesResolvedInDay] })
  @common.HttpCode(200)
  @common.Get('/users/:userId/user-cases-resolved-daily')
  async getUserCasesResolvedDaily(
    @common.Param('userId') userId: string,
    @common.Query() query: GetUserCasesResolvedDailyDto,
  ): Promise<UserCasesResolvedInDay[]> {
    return await this.metricsService.listUserCasesResolvedDaily({
      fromDate: query.fromDate,
      userId: userId,
    });
  }

  @ApiOkResponse({ type: [ActiveUserModel] })
  @common.HttpCode(200)
  @common.Get('/users/active-users')
  async getActiveUsers(@common.Query() query: GetActiveUsersDto): Promise<ActiveUserModel[]> {
    return await this.metricsService.listActiveUsers(query);
  }
}
