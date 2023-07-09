export interface IResolvedCasesDailyMetric {
  date: string;
  count: number;
}

export interface IUserStats {
  approvalRate: number;
  averageResolutionTime: number;
  averageAssignmentTime: number;
  averageReviewTime: number;
}

export interface GetUserStatsDto {
  fromDate: number;
}

export interface GetUserDailyCasesResolvedStatsDto {
  fromDate: number;
}
