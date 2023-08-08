export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  lastActiveAt: Date | null;
  projectIds?: Array<string>;
}
