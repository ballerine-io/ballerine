import type { JsonValue } from 'type-fest';
import {Customer, User, UserToProject} from "@prisma/client";

export type InputJsonValue = Omit<JsonValue, 'null'>;

export interface IObjectWithId {
  id: string;
}

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type TProjectId = Array<string> | null;

export type UserWithProjects = User & { userToProjects: Omit<UserToProject[], 'userId'> };
export type CustomerWithProjectIds = Customer & { projectIds: Array<TProjectId> };
