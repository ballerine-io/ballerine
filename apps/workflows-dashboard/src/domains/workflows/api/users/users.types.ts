export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  lastActiveAt: string | null;
}

export interface GetActiveUsersDto {
  // fromDate: number;
}
