export interface IUserCaseResolvingStats {
  id: string;
  firstName: string;
  lastName: string;
  casesCount: number;
  email: string;
}

export interface GetUsersCaseResolvingStats {
  fromDate: number;
}

export interface GetUsersAssignedCasesStatsDto {
  fromDate?: number;
}
