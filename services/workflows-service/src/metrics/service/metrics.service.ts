import { MetricsRepository } from '@/metrics/repository/metrics.repository';
import { ActiveUserModel } from '@/metrics/repository/models/active-user.model';
import { UserAssignedCasesStatisticModel } from '@/metrics/repository/models/user-assigned-cases-statistic.model';
import { CasesResolvedInDay } from '@/metrics/repository/models/cases-resolved-daily.model';
import { UserResolvedCasesStatisticModel } from '@/metrics/repository/models/user-resolved-cases-statistic.model';
import { WorkflowRuntimeStatisticModel } from '@/metrics/repository/models/workflow-runtime-statistic.model';
import { WorkflowRuntimeStatusCaseCountModel } from '@/metrics/repository/models/workflow-runtime-status-case-count.model';
import { FindUsersAssignedCasesStatisticParams } from '@/metrics/repository/types/find-users-assigned-cases-statistic.params';
import { FindUsersResolvedCasesStatisticParams } from '@/metrics/repository/types/find-users-resolved-cases-statistic.params';
import { GetRuntimeStatusCaseCountParams } from '@/metrics/repository/types/get-runtime-status-case-count.params';
import { ListActiveUsersParams } from '@/metrics/repository/types/list-active-users.params';
import { ListUserCasesResolvedDailyParams } from '@/metrics/repository/types/list-user-cases-resolved-daily.params';
import { UserWorkflowProcessingStatisticModel } from '@/metrics/service/models/user-workflow-processing-statistic.model';
import { GetUserWorkflowProcessingStatisticParams } from '@/metrics/service/types/get-user-workflow-processing-statistic.params';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async getRuntimesStatusCaseCount(
    params: GetRuntimeStatusCaseCountParams,
  ): Promise<WorkflowRuntimeStatusCaseCountModel> {
    return await this.metricsRepository.getRuntimeStatusCaseCount(params);
  }

  async listRuntimesStatistic(): Promise<WorkflowRuntimeStatisticModel[]> {
    return await this.metricsRepository.findRuntimeStatistic();
  }

  async listUsersAssignedCasesStatistic(
    params: FindUsersAssignedCasesStatisticParams,
  ): Promise<UserAssignedCasesStatisticModel[]> {
    return await this.metricsRepository.findUsersAssignedCasesStatistic(params);
  }

  async listUsersResolvedCasesStatistic(
    params: FindUsersResolvedCasesStatisticParams,
  ): Promise<UserResolvedCasesStatisticModel[]> {
    return await this.metricsRepository.findUsersResolvedCasesStatistic(params);
  }

  async getUserWorkflowProcessingStatistic(
    params: GetUserWorkflowProcessingStatisticParams,
  ): Promise<UserWorkflowProcessingStatisticModel> {
    const commonParams = {
      userId: params.userId,
      fromDate: params.fromDate,
    };

    const results = await Promise.all([
      this.metricsRepository.getUserApprovalRate(commonParams),
      this.metricsRepository.getUserAverageAssignmentTime(commonParams),
      this.metricsRepository.getUserAverageResolutionTime(commonParams),
      this.metricsRepository.getUserAverageReviewTime(commonParams),
    ]);

    const [
      approvalRateModel,
      averageAssignmentTimeModel,
      averageResolutionTimeModel,
      averageReviewTimeModel,
    ] = results;

    const statisticModel: UserWorkflowProcessingStatisticModel =
      new UserWorkflowProcessingStatisticModel();

    if (params.userId) {
      statisticModel.id = params.userId;
    }

    statisticModel.approvalRate = approvalRateModel?.approvalRate || 0;
    statisticModel.averageAssignmentTime = averageAssignmentTimeModel?.time || 0;
    statisticModel.averageResolutionTime = averageResolutionTimeModel?.time || 0;
    statisticModel.averageReviewTime = averageReviewTimeModel?.time || 0;

    return statisticModel;
  }

  async listUserCasesResolvedDaily(
    params: ListUserCasesResolvedDailyParams,
  ): Promise<CasesResolvedInDay[]> {
    return await this.metricsRepository.listCasesResolvedDaily(params);
  }

  async listActiveUsers(params: ListActiveUsersParams): Promise<ActiveUserModel[]> {
    return await this.metricsRepository.listActiveUsers(params);
  }
}
