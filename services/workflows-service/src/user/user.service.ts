import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PasswordService } from '../auth/password/password.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    protected readonly repository: UserRepository,
    protected readonly passwordService: PasswordService,
  ) {}

  async create(args: Parameters<UserRepository['create']>[0]): Promise<User> {
    return this.repository.create(args);
  }

  async list(args?: Parameters<UserRepository['findMany']>[0]): Promise<User[]> {
    return this.repository.findMany(args);
  }

  async getById(
    id: string,
    args?: Parameters<UserRepository['findById']>[1],
  ): Promise<User | null> {
    return this.repository.findById(id, args);
  }

  async getByUsername(
    email: string,
    args?: Parameters<UserRepository['findByUsername']>[1],
  ): Promise<User | null> {
    return this.repository.findByUsername(email, args);
  }

  async updateById(id: string, args: Parameters<UserRepository['updateById']>[1]): Promise<User> {
    return this.repository.updateById(id, args);
  }

  async deleteById(id: string, args?: Parameters<UserRepository['deleteById']>[1]): Promise<User> {
    return this.repository.deleteById(id, args);
  }
}
