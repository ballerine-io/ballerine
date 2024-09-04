import { MetricsRepository } from '@/metrics/repository/metrics.repository';
import { CasesResolvedInDay } from '@/metrics/repository/models/cases-resolved-daily.model';
import { MetricsUserModel } from '@/metrics/repository/models/metrics-user.model';
import { UserAssignedCasesStatisticModel } from '@/metrics/repository/models/user-assigned-cases-statistic.model';
import { UserResolvedCasesStatisticModel } from '@/metrics/repository/models/user-resolved-cases-statistic.model';
import { WorkflowDefinitionVariantsMetricModel } from '@/metrics/repository/models/workflow-definition-variants-metric.model';
import { WorkflowRuntimeStatisticModel } from '@/metrics/repository/models/workflow-runtime-statistic.model';
import { WorkflowRuntimeStatusCaseCountModel } from '@/metrics/repository/models/workflow-runtime-status-case-count.model';
import { FindUsersAssignedCasesStatisticParams } from '@/metrics/repository/types/find-users-assigned-cases-statistic.params';
import { FindUsersResolvedCasesStatisticParams } from '@/metrics/repository/types/find-users-resolved-cases-statistic.params';
import { GetRuntimeStatusCaseCountParams } from '@/metrics/repository/types/get-runtime-status-case-count.params';
import { ListUserCasesResolvedDailyParams } from '@/metrics/repository/types/list-user-cases-resolved-daily.params';
import { UserWorkflowProcessingStatisticModel } from '@/metrics/service/models/user-workflow-processing-statistic.model';
import { GetUserWorkflowProcessingStatisticParams } from '@/metrics/service/types/get-user-workflow-processing-statistic.params';
import type { TProjectId, TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  constructor(private readonly metricsRepository: MetricsRepository) {}

  async getRuntimesStatusCaseCount(
    params: GetRuntimeStatusCaseCountParams,
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeStatusCaseCountModel> {
    return await this.metricsRepository.getRuntimeStatusCaseCount(params, projectIds);
  }

  async listRuntimesStatistic(projectIds: TProjectIds): Promise<WorkflowRuntimeStatisticModel[]> {
    return await this.metricsRepository.findRuntimeStatistic(projectIds);
  }

  async listUsersAssignedCasesStatistic(
    params: FindUsersAssignedCasesStatisticParams,
    projectIds: TProjectIds,
  ): Promise<UserAssignedCasesStatisticModel[]> {
    return await this.metricsRepository.findUsersAssignedCasesStatistic(params, projectIds);
  }

  async listUsersResolvedCasesStatistic(
    params: FindUsersResolvedCasesStatisticParams,
    projectIds: TProjectIds,
  ): Promise<UserResolvedCasesStatisticModel[]> {
    return await this.metricsRepository.findUsersResolvedCasesStatistic(params, projectIds);
  }

  async getUserWorkflowProcessingStatistic(
    params: GetUserWorkflowProcessingStatisticParams,
    projectIds: TProjectIds,
  ): Promise<UserWorkflowProcessingStatisticModel> {
    const commonParams = {
      fromDate: params.fromDate,
    };

    const results = await Promise.all([
      this.metricsRepository.getUserApprovalRate(commonParams, projectIds),
      this.metricsRepository.getUserAverageAssignmentTime(commonParams, projectIds),
      this.metricsRepository.getUserAverageResolutionTime(commonParams, projectIds),
      this.metricsRepository.getUserAverageReviewTime(commonParams, projectIds),
    ]);

    const [
      approvalRateModel,
      averageAssignmentTimeModel,
      averageResolutionTimeModel,
      averageReviewTimeModel,
    ] = results;

    const statisticModel: UserWorkflowProcessingStatisticModel =
      new UserWorkflowProcessingStatisticModel();

    statisticModel.approvalRate = approvalRateModel?.approvalRate || '0';
    statisticModel.averageAssignmentTime = averageAssignmentTimeModel?.time || '0';
    statisticModel.averageResolutionTime = averageResolutionTimeModel?.time || '0';
    statisticModel.averageReviewTime = averageReviewTimeModel?.time || '0';

    return statisticModel;
  }

  async listUserCasesResolvedDaily(
    params: ListUserCasesResolvedDailyParams,
    projectIds: TProjectIds,
  ): Promise<CasesResolvedInDay[]> {
    return await this.metricsRepository.listCasesResolvedDaily(params, projectIds);
  }

  async listActiveUsers(projectIds: TProjectIds): Promise<MetricsUserModel[]> {
    return await this.metricsRepository.listUsers(projectIds);
  }

  async getWorkflowDefinitionVariantsMetric(
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinitionVariantsMetricModel[]> {
    return await this.metricsRepository.getWorkflowDefinitionVariantsMetric(projectIds);
  }

  async getHomeMetrics(currentProjectId: TProjectId) {
    const [riskIndicators, reportStatuses, mccCounts, allRiskLevels, completedRiskLevels] =
      await Promise.all([
        this.metricsRepository.getRiskIndicators(currentProjectId),
        this.metricsRepository.getReportStatusesCount(currentProjectId),
        this.metricsRepository.getReportMCCsCount(currentProjectId),
        this.metricsRepository.getReportsByRiskLevel(currentProjectId),
        this.metricsRepository.getApprovedBusinessesReportsByRiskLevel(currentProjectId),
      ]);

    return {
      mccCounts,
      riskIndicators,
      reportStatuses,
      reportsRisks: {
        all: allRiskLevels,
        approved: completedRiskLevels,
      },
    };
  }
}
