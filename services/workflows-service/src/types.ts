import type { JsonValue } from 'type-fest';
import { Customer, Project, User, UserToProject } from '@prisma/client';

export type InputJsonValue = Omit<JsonValue, 'null'>;

export interface IObjectWithId {
  id: string;
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type TProjectIds = Array<string> | null;

export type UserWithProjects = User & { userToProjects?: Omit<UserToProject[], 'userId'> };
export type CustomerWithProjectIds = Customer & { projectIds: TProjectIds };
export type CustomerWithProjects = Partial<Customer & { projects: Array<Project> }>;
export type AuthenticatedEntity = {
  user?: Partial<User>;
  customer?: Partial<Customer>;
  projectIds: TProjectIds;
  type: 'user' | 'customer' | 'admin';
};


