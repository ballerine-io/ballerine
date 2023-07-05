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
  userId: string;
  fromDate: number;
}

export interface GetUserDailyCasesResolvedStatsDto {
  userId: string;
  fromDate: number;
}
