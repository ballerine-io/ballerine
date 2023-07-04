export interface IUserCaseResolvingStats {
  id: string;
  firstName: string;
  lastName: string;
  cases: number;
  email: string;
}

export interface GetUsersCaseResolvingStats {
  fromDate?: number;
}
