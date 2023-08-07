import {User, UserToProject} from "@prisma/client";

export type UserWithProjects = User & { userToProjects: Omit<UserToProject[], 'userId'> };
