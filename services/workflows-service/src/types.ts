import type { JsonValue } from 'type-fest';
import { Customer, Project, User, UserToProject } from '@prisma/client';

export type InputJsonValue = Omit<JsonValue, 'null'>;

export interface IObjectWithId {
  id: string;
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type TProjectIds = Array<string> | null;
export type TProjectId = string;

export type TExpires = { expires: Date };
export type UserWithProjects = User & {
  userToProjects?: Omit<UserToProject[], 'userId'>;
};
export type CustomerWithProjectIds = Customer & { projectIds: TProjectIds };
export type CustomerWithProjects = Partial<Customer & { projects: Array<Project> }>;
export type AuthenticatedEntity = {
  user?: Partial<User>;
  customer?: Partial<Customer>;
  type: 'user' | 'customer' | 'admin';
};
export type AuthenticatedEntityWithProjects = AuthenticatedEntity & { projectIds: TProjectIds };

export type ObjectValues<TObject extends Record<PropertyKey, any>> = TObject[keyof TObject];
