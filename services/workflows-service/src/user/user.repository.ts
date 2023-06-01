import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from '../auth/password/password.service';
import { transformStringFieldUpdateInput } from '../prisma/prisma.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly passwordService: PasswordService,
  ) {}

  async create<T extends Prisma.UserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>,
  ): Promise<User> {
    return this.prisma.user.create<T>({
      ...args,
      data: {
        ...args.data,
        // Use Prisma middleware
        password: await this.passwordService.hash(args.data.password),
      },
    });
  }

  async findMany<T extends Prisma.UserFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
  ): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  async findById<T extends Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.UserFindUniqueOrThrowArgs, 'where'>>,
  ): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByEmail<T extends Omit<Prisma.UserFindUniqueArgs, 'where'>>(
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
    args?: Prisma.SelectSubset<T, Omit<Prisma.UserDeleteArgs, 'where'>>,
  ): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
      ...args,
    });
  }
}
