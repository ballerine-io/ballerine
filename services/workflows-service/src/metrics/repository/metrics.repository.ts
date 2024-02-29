import { WorkflowRuntimeStatisticModel } from '@/metrics/repository/models/workflow-runtime-statistic.model';
import { IAggregateWorkflowRuntimeStatistic } from '@/metrics/repository/types/aggregate-workflow-runtime-statistic';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IAggregateUsersWithCasesCount } from '@/metrics/repository/types/aggregate-users-with-cases-count';
import { WorkflowRuntimeStatusCaseCountModel } from '@/metrics/repository/models/workflow-runtime-status-case-count.model';
import { buildAggregateWorkflowRuntimeStatusCaseCountQuery } from './sql/build-aggregate-workflow-runtime-status-case-count.sql';
import { IAggregateWorkflowRuntimeStatusCaseCount } from '@/metrics/repository/types/aggregate-workflow-runtime-status-case-count';
import { GetRuntimeStatusCaseCountParams } from '@/metrics/repository/types/get-runtime-status-case-count.params';
import { GetUserApprovalRateParams } from '@/metrics/repository/types/get-user-approval-rate.params';
import { ApprovalRateModel } from '@/metrics/repository/models/approval-rate.model';
import { IAggregateApprovalRate } from '@/metrics/repository/types/aggregate-approval-rate';
import { GetUserAverageResolutionTimeParams } from '@/metrics/repository/types/get-user-average-resolution-time.params';
import { AverageResolutionTimeModel } from '@/metrics/repository/models/average-resolution-time.model';
import { buildAggregateAverageResolutionTimeQuery } from './sql/build-aggregate-average-resolution-time.sql';
import { IAggregateAverageResolutionTime } from '@/metrics/repository/types/aggregate-average-resolution-time';
import { GetUserAverageAssignmentTimeParams } from '@/metrics/repository/types/get-user-average-assignment-time.params';
import { IAggregateAverageAssignmentTime } from '@/metrics/repository/types/aggregate-average-assignment-time';
import { GetUserAverageReviewTimeParams } from '@/metrics/repository/types/get-user-average-review-time.params';
import { AverageReviewTimeModel } from '@/metrics/repository/models/average-review-time.model';
import { IAggregateAverageReviewTime } from '@/metrics/repository/types/aggregate-average-review-time';
import { ListUserCasesResolvedDailyParams } from '@/metrics/repository/types/list-user-cases-resolved-daily.params';
import { CasesResolvedInDay } from '@/metrics/repository/models/cases-resolved-daily.model';
import { IAggregateCasesResolvedDaily } from '@/metrics/repository/types/aggregate-cases-resolved-daily';
import { buildAggregateDailyCasesResolvedQuery } from '@/metrics/repository/sql/build-aggregate-daily-cases-resolved.sql';
import { MetricsUserModel } from '@/metrics/repository/models/metrics-user.model';
import { ISelectActiveUser } from '@/metrics/repository/types/select-active-user';
import { buildSelectActiveUsersQuery } from '@/metrics/repository/sql/build-select-active-users.sql';
import { FindUsersAssignedCasesStatisticParams } from '@/metrics/repository/types/find-users-assigned-cases-statistic.params';
import { UserAssignedCasesStatisticModel } from '@/metrics/repository/models/user-assigned-cases-statistic.model';
import { buildAggregateUsersAssignedCasesStatisticQuery } from '@/metrics/repository/sql/build-aggregate-users-assigned-cases-statistic.sql';
import { FindUsersResolvedCasesStatisticParams } from '@/metrics/repository/types/find-users-resolved-cases-statistic.params';
import { UserResolvedCasesStatisticModel } from '@/metrics/repository/models/user-resolved-cases-statistic.model';
import { IAggregateUserResolvedCasesStatistic } from '@/metrics/repository/types/aggregate-user-resolved-cases-statistic';
import { buildAggregateUsersResolvedCasesStatisticQuery } from '@/metrics/repository/sql/build-aggregate-users-resolved-cases-statistic.sql';
import { buildAggregateApprovalRateQuery } from '@/metrics/repository/sql/build-aggregate-approval-rate.sql';
import { buildAggregateAverageAssignmentTimeQuery } from '@/metrics/repository/sql/build-aggregate-average-assignment-time.sql';
import { AverageAssignmentTimeModel } from '@/metrics/repository/models/average-assignment-time.model';
import { buildAggregateAverageReviewTimeQuery } from '@/metrics/repository/sql/build-aggregate-average-review-time.sql';
import type { TProjectIds } from '@/types';
import { buildAggregateWorkflowRuntimeStatisticQuery } from '@/metrics/repository/sql/build-aggregate-workflow-runtime-statistic.sql';

@Injectable()
export class MetricsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getRuntimeStatusCaseCount(
    params: GetRuntimeStatusCaseCountParams,
    projectIds: TProjectIds,
  ): Promise<WorkflowRuntimeStatusCaseCountModel> {
    const results = await this.prismaService.$queryRaw<IAggregateWorkflowRuntimeStatusCaseCount[]>(
      buildAggregateWorkflowRuntimeStatusCaseCountQuery(params.fromDate, projectIds),
    );

    return plainToClass(
      WorkflowRuntimeStatusCaseCountModel,
      results.length ? results.at(-1) : { active: 0, failed: 0, completed: 0 },
    );
  }

  async findRuntimeStatistic(projectIds: TProjectIds): Promise<WorkflowRuntimeStatisticModel[]> {
    const results = await this.prismaService.$queryRaw<IAggregateWorkflowRuntimeStatistic[]>(
      buildAggregateWorkflowRuntimeStatisticQuery(projectIds),
    );

    return results.map(result =>
      plainToClass(WorkflowRuntimeStatisticModel, {
        id: result.workflowDefinitionId,
        name: result.workflowDefinitionName,
        active: result.active || 0,
        completed: result.completed || 0,
        failed: result.failed,
      }),
    );
  }

  async findUsersAssignedCasesStatistic(
    params: FindUsersAssignedCasesStatisticParams,
    projectIds: TProjectIds,
  ): Promise<UserAssignedCasesStatisticModel[]> {
    const results = await this.prismaService.$queryRaw<IAggregateUsersWithCasesCount[]>(
      buildAggregateUsersAssignedCasesStatisticQuery(params.fromDate, projectIds),
    );

    return results.map(result => plainToClass(UserAssignedCasesStatisticModel, result));
  }

  async findUsersResolvedCasesStatistic(
    params: FindUsersResolvedCasesStatisticParams,
    projectIds: TProjectIds,
  ): Promise<UserResolvedCasesStatisticModel[]> {
    const results = await this.prismaService.$queryRaw<IAggregateUserResolvedCasesStatistic[]>(
      buildAggregateUsersResolvedCasesStatisticQuery(params.fromDate, projectIds),
    );

    return results.map(result =>
      plainToClass(UserResolvedCasesStatisticModel, {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        casesCount: result.casesCount,
        email: result.email,
      }),
    );
  }

  async getUserApprovalRate(
    params: GetUserApprovalRateParams,
    projectIds: TProjectIds,
  ): Promise<ApprovalRateModel | null> {
    const results = await this.prismaService.$queryRaw<IAggregateApprovalRate[]>(
      buildAggregateApprovalRateQuery(params.fromDate, projectIds),
    );

    return results.length
      ? plainToClass(ApprovalRateModel, { approvalRate: results.at(-1)?.approvalRate })
      : null;
  }

  async getUserAverageResolutionTime(
    params: GetUserAverageResolutionTimeParams,
    projectIds: TProjectIds,
  ): Promise<AverageResolutionTimeModel | null> {
    const results = await this.prismaService.$queryRaw<IAggregateAverageResolutionTime[]>(
      buildAggregateAverageResolutionTimeQuery(params.fromDate, projectIds),
    );

    return results.length
      ? plainToClass(AverageResolutionTimeModel, { time: results.at(-1)?.average_time })
      : null;
  }

  async getUserAverageAssignmentTime(
    params: GetUserAverageAssignmentTimeParams,
    projectIds: TProjectIds,
  ): Promise<AverageAssignmentTimeModel | null> {
    const results = await this.prismaService.$queryRaw<IAggregateAverageAssignmentTime[]>(
      buildAggregateAverageAssignmentTimeQuery(params.fromDate, projectIds),
    );

    return results.length
      ? plainToClass(AverageAssignmentTimeModel, { time: results.at(-1)?.average_time })
      : null;
  }

  async getUserAverageReviewTime(
    params: GetUserAverageReviewTimeParams,
    projectIds: TProjectIds,
  ): Promise<AverageReviewTimeModel | null> {
    const results = await this.prismaService.$queryRaw<IAggregateAverageReviewTime[]>(
      buildAggregateAverageReviewTimeQuery(params.fromDate, projectIds),
    );

    return results.length
      ? plainToClass(AverageReviewTimeModel, { time: results.at(-1)?.average_time })
      : null;
  }

  async listCasesResolvedDaily(
    params: ListUserCasesResolvedDailyParams,
    projectIds: TProjectIds,
  ): Promise<CasesResolvedInDay[]> {
    const results = await this.prismaService.$queryRaw<IAggregateCasesResolvedDaily[]>(
      buildAggregateDailyCasesResolvedQuery(params.fromDate, params.userId, projectIds),
    );

    if (!results.length) return [];

    return results.map(result =>
      plainToClass(CasesResolvedInDay, {
        date: result.date,
        count: result.cases,
      }),
    );
  }

  async listUsers(projectIds: TProjectIds): Promise<MetricsUserModel[]> {
    const results = await this.prismaService.$queryRaw<ISelectActiveUser[]>(
      buildSelectActiveUsersQuery(projectIds),
    );

    return results.map(result => plainToClass(MetricsUserModel, result));
  }
}
