import { WorkflowRuntimeStatisticModel } from '@/metrics/repository/models/workflow-runtime-statistic.model';
import { IAggregateWorkflowRuntimeStatistic } from '@/metrics/repository/types/aggregate-workflow-runtime-statistic';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IAggregateUsersWithCasesCount } from '@/metrics/repository/types/aggregate-users-with-cases-count';
import { WorkflowRuntimeStatusCaseCountModel } from '@/metrics/repository/models/workflow-runtime-status-case-count.model';
import { aggregateWorkflowRuntimeStatisticQuery } from './sql/aggregate-workflow-runtime-statistic.sql';
import { aggregateWorkflowRuntimeStatusCaseCountQuery } from './sql/aggregate-workflow-runtime-status-case-count.sql';
import { IAggregateWorkflowRuntimeStatusCaseCount } from '@/metrics/repository/types/aggregate-workflow-runtime-status-case-count';
import { GetRuntimeStatusCaseCountParams } from '@/metrics/repository/types/get-runtime-status-case-count.params';
import { GetUserApprovalRateParams } from '@/metrics/repository/types/get-user-approval-rate.params';
import { UserApprovalRateModel } from '@/metrics/repository/models/user-approval-rate.model';
import { aggregateUserApprovalRateQuery } from './sql/aggregate-user-approval-rate.sql';
import { IAggregateUserApprovalRate } from '@/metrics/repository/types/aggregate-user-approval-rate';
import { GetUserAverageResolutionTimeParams } from '@/metrics/repository/types/get-user-average-resolution-time.params';
import { UserAverageResolutionTimeModel } from '@/metrics/repository/models/user-average-resolution-time.model';
import { aggregateUserAverageResolutionTimeQuery } from './sql/aggregate-user-average-resolution-time.sql';
import { IAggregateUserAverageResolutionTime } from '@/metrics/repository/types/aggregate-user-average-resolution-time';
import { GetUserAverageAssignmentTimeParams } from '@/metrics/repository/types/get-user-average-assignment-time.params';
import { UserAverageAssignmentTimeModel } from '@/metrics/repository/models/user-average-assignment-time.model';
import { IAggregateUserAverageAssignmentTime } from '@/metrics/repository/types/aggregate-user-average-assignment-time';
import { aggregateUserAverageAssignmentTimeQuery } from '@/metrics/repository/sql/aggregate-user-average-assignment-time.sql';
import { GetUserAverageReviewTimeParams } from '@/metrics/repository/types/get-user-average-review-time.params';
import { UserAverageReviewTimeModel } from '@/metrics/repository/models/user-average-review-time.model';
import { aggregateUserAverageReviewTimeQuery } from '@/metrics/repository/sql/aggregate-user-average-review-time.sql';
import { IAggregateUserAverageReviewTime } from '@/metrics/repository/types/aggregate-user-average-review-time';
import { ListUserCasesResolvedDailyParams } from '@/metrics/repository/types/list-user-cases-resolved-daily.params';
import { UserCasesResolvedInDay } from '@/metrics/repository/models/user-cases-resolved-daily.model';
import { IAggregateUserCasesResolvedDaily } from '@/metrics/repository/types/aggregate-user-cases-resolved-daily';
import { aggregateUserDailyCasesResolvedQuery } from '@/metrics/repository/sql/aggregate-user-daily-cases-resolved.sql';
import { ListActiveUsersParams } from '@/metrics/repository/types/list-active-users.params';
import { ActiveUserModel } from '@/metrics/repository/models/active-user.model';
import { ISelectActiveUser } from '@/metrics/repository/types/select-active-user';
import { selectActiveUsersQuery } from '@/metrics/repository/sql/select-active-users.sql';
import { FindUsersAssignedCasesStatisticParams } from '@/metrics/repository/types/find-users-assigned-cases-statistic.params';
import { UserAssignedCasesStatisticModel } from '@/metrics/repository/models/user-assigned-cases-statistic.model';
import { aggregateUsersAssignedCasesStatisticQuery } from '@/metrics/repository/sql/aggregate-users-assigned-cases-statistic.sql';
import { FindUsersResolvedCasesStatisticParams } from '@/metrics/repository/types/find-users-resolved-cases-statistic.params';
import { UserResolvedCasesStatisticModel } from '@/metrics/repository/models/user-resolved-cases-statistic.model';
import { IAggregateUserResolvedCasesStatistic } from '@/metrics/repository/types/aggregate-user-resolved-cases-statistic';
import { aggregateUsersResolvedCasesStatisticQuery } from '@/metrics/repository/sql/aggregate-users-resolved-cases-statistic.sql';

@Injectable()
export class MetricsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getRuntimeStatusCaseCount(
    params: GetRuntimeStatusCaseCountParams,
  ): Promise<WorkflowRuntimeStatusCaseCountModel> {
    const results = await this.prismaService.$queryRawUnsafe<
      IAggregateWorkflowRuntimeStatusCaseCount[]
    >(aggregateWorkflowRuntimeStatusCaseCountQuery, params.fromDate);

    return plainToClass(
      WorkflowRuntimeStatusCaseCountModel,
      results.length ? results.at(-1) : { active: 0, failed: 0, completed: 0 },
    );
  }

  async findRuntimeStatistic(): Promise<WorkflowRuntimeStatisticModel[]> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateWorkflowRuntimeStatistic[]>(
      aggregateWorkflowRuntimeStatisticQuery,
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
  ): Promise<UserAssignedCasesStatisticModel[]> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateUsersWithCasesCount[]>(
      aggregateUsersAssignedCasesStatisticQuery,
      params.fromDate,
    );

    return results.map(result => plainToClass(UserAssignedCasesStatisticModel, result));
  }

  async findUsersResolvedCasesStatistic(
    params: FindUsersResolvedCasesStatisticParams,
  ): Promise<UserResolvedCasesStatisticModel[]> {
    const results = await this.prismaService.$queryRawUnsafe<
      IAggregateUserResolvedCasesStatistic[]
    >(aggregateUsersResolvedCasesStatisticQuery, params.fromDate);

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
  ): Promise<UserApprovalRateModel | null> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateUserApprovalRate[]>(
      aggregateUserApprovalRateQuery,
      params.userId,
      params.fromDate,
    );

    return results.length ? plainToClass(UserApprovalRateModel, results.at(-1)) : null;
  }

  async getUserAverageResolutionTime(
    params: GetUserAverageResolutionTimeParams,
  ): Promise<UserAverageResolutionTimeModel | null> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateUserAverageResolutionTime[]>(
      aggregateUserAverageResolutionTimeQuery,
      params.userId,
      params.fromDate,
    );

    return results.length ? plainToClass(UserAverageResolutionTimeModel, results.at(-1)) : null;
  }

  async getUserAverageAssignmentTime(
    params: GetUserAverageAssignmentTimeParams,
  ): Promise<UserAverageAssignmentTimeModel | null> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateUserAverageAssignmentTime[]>(
      aggregateUserAverageAssignmentTimeQuery,
      params.userId,
      params.fromDate,
    );

    return results.length ? plainToClass(UserAverageAssignmentTimeModel, results.at(-1)) : null;
  }

  async getUserAverageReviewTime(
    params: GetUserAverageReviewTimeParams,
  ): Promise<UserAverageReviewTimeModel | null> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateUserAverageReviewTime[]>(
      aggregateUserAverageReviewTimeQuery,
      params.userId,
      params.fromDate,
    );

    return results.length ? plainToClass(UserAverageReviewTimeModel, results.at(-1)) : null;
  }

  async listUserCasesResolvedDaily(
    params: ListUserCasesResolvedDailyParams,
  ): Promise<UserCasesResolvedInDay[]> {
    const results = await this.prismaService.$queryRawUnsafe<IAggregateUserCasesResolvedDaily[]>(
      aggregateUserDailyCasesResolvedQuery,
      params.userId,
      params.fromDate.toISOString(),
      new Date().toDateString(),
    );

    console.log({ fromDate: +params.fromDate, to: +new Date() });

    if (!results.length) return [];

    return results.map(result =>
      plainToClass(UserCasesResolvedInDay, {
        id: params.userId,
        date: result.date,
        count: result.cases,
      }),
    );
  }

  async listActiveUsers(params: ListActiveUsersParams): Promise<ActiveUserModel[]> {
    const results = await this.prismaService.$queryRawUnsafe<ISelectActiveUser[]>(
      selectActiveUsersQuery,
      params.fromDate,
    );

    return results.map(result => plainToClass(ActiveUserModel, result));
  }
}
