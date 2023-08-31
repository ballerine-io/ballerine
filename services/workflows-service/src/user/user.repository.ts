import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from '../auth/password/password.service';
import { transformStringFieldUpdateInput } from '../prisma/prisma.util';
import { Injectable } from '@nestjs/common';
import { TProjectIds, UserWithProjects } from '@/types';
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
    projectIds: TProjectIds,
  ): Promise<User> {
    return this.prisma.user.create<T>(
      this.scopeService.scopeCreate(
        {
          ...args,
          data: {
            ...args.data,
            // Use Prisma middleware
            password: await this.passwordService.hash(args.data.password),
          },
        } as any,
        projectIds,
      ),
    );
  }

  async findMany<T extends Prisma.UserFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<User[]> {
    return this.prisma.user.findMany(this.scopeService.scopeFindMany(args, projectIds));
  }

  async findById<T extends Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<UserWithProjects> {
    return this.prisma.user.findUniqueOrThrow(
      this.scopeService.scopeFindOne(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
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

  async updateById<T extends Omit<Prisma.UserUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserUpdateArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<User> {
    return this.prisma.user.update<T & { where: { id: string } }>(
      this.scopeService.scopeUpdate(
        {
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
        } as any,
        projectIds,
      ),
    );
  }

  async deleteById<T extends Omit<Prisma.UserDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.UserDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<User> {
    return this.prisma.user.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async queryRawUnscoped<TValue>(query: string, values: any[] = []): Promise<TValue> {
    return (await this.prisma.$queryRawUnsafe.apply(this.prisma, [query, ...values])) as TValue;
  }
}
