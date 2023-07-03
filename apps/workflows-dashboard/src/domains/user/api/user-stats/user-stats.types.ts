export interface IResolvedCasesDailyMetric {
  date: string;
  casesPerDay: number;
}

export interface IUserStats {
  approvalRate: number;
  averageResolutionTime: number;
  averageAssignmentTime: number;
  averageReviewTime: number;
}

export interface GetUserStatsDto {
  fromDate?: number;
}

export interface GetUserCaseResolvingStatsDto {
  fromDate?: number;
}
