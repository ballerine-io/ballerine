import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from '../auth/password/password.service';
import { transformStringFieldUpdateInput } from '../prisma/prisma.util';
import { Injectable } from '@nestjs/common';
import type { TProjectId, TProjectIds, UserWithProjects } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class UserRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly passwordService: PasswordService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.UserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>,
    projectId: TProjectId,
  ): Promise<User> {
    args.data.userToProjects ||= {
      createMany: {
        data: projectId ? [{ projectId }] : [],
      },
    };

    return this.prisma.user.create<T>({
      ...args,
      data: {
        ...args.data,
        // Use Prisma middleware
        password: await this.passwordService.hash(args.data.password),
      },
    } as any);
  }

  async findMany<T extends Prisma.UserFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<User[]> {
    const scopedArgs = {
      ...args,
      where: {
        ...args?.where,
        userToProjects: !args?.where?.userToProjects
          ? {
              every: {
                projectId: {
                  in: projectIds!.map(projectId => projectId),
                },
              },
            }
          : args.where.userToProjects,
      },
    };

    return this.prisma.user.findMany(scopedArgs);
  }

  async findById<T extends Omit<Prisma.UserFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserFindFirstOrThrowArgs, 'where'>>,
    projectIds?: TProjectIds,
  ): Promise<UserWithProjects> {
    return this.prisma.user.findFirstOrThrow({
      where: { id, userToProjects: { some: { projectId: { in: projectIds || [] } } } },
      ...args,
    });
  }

  async findByIdUnscoped<T extends Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>>,
  ): Promise<UserWithProjects> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByEmailUnscoped<T extends Omit<Prisma.UserFindUniqueArgs, 'where'>>(
    email: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.UserFindUniqueArgs, 'where'>>,
  ): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
      ...args,
    });
  }

  async updateByIdUnscoped<T extends Omit<Prisma.UserUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserUpdateArgs, 'where'>>,
  ): Promise<User> {
    return this.prisma.user.update<T & { where: { id: string } }>({
      where: { id },
      ...args,
      data: {
        ...args.data,
        password:
          args.data.password &&
          (await transformStringFieldUpdateInput(args.data.password, password =>
            this.passwordService.hash(password),
          )),
      },
    });
  }

  async deleteById<T extends Omit<Prisma.UserDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserDeleteArgs, 'where'>>,
    projectIds?: TProjectIds,
  ): Promise<User> {
    await this.prisma.userToProject.deleteMany({
      where: { userId: id, projectId: { in: projectIds || [] } },
    });

    return this.prisma.user.delete({
      where: { id },
      ...args,
    });
  }
}
