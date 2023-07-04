import { ListUsersCaseResolveStatsParams } from '@/user/types';
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

  async create(args: Parameters<UserRepository['create']>[0]) {
    return this.repository.create(args);
  }

  async list(args?: Parameters<UserRepository['findMany']>[0]) {
    return this.repository.findMany(args);
  }

  async getById(id: string, args?: Parameters<UserRepository['findById']>[1]) {
    return this.repository.findById(id, args);
  }

  async getByEmail(email: string, args?: Parameters<UserRepository['findByEmail']>[1]) {
    return this.repository.findByEmail(email, args);
  }

  async updateById(id: string, args: Parameters<UserRepository['updateById']>[1]) {
    return this.repository.updateById(id, args);
  }

  async deleteById(id: string, args?: Parameters<UserRepository['deleteById']>[1]) {
    return this.repository.deleteById(id, args);
  }

  async listUsersCaseResolveStats(params: ListUsersCaseResolveStatsParams) {
    const rawQuery = `
    select
      user_cases."assigneeId" as id,
      SUM(cases_per_day)::int as cases,
      "firstName",
      "lastName",
      "email"
    from
      "User"
    inner join (
      select
        date_trunc('day',
        "resolvedAt") as day,
        count(*)::int as cases_per_day,
        "assigneeId"
      from
        "WorkflowRuntimeData"
      where "resolvedAt" notnull
      ${params.fromDate ? 'and "resolvedAt" >= $1' : ''}
      group by "assigneeId", "day"
      )
      as user_cases
      on "User".id = user_cases."assigneeId"
    group by id, user_cases."assigneeId"`;

    return await this.repository.queryRaw<
      { id: string; firstName: string; lastName: string; cases: number }[]
    >(rawQuery, params.fromDate ? [params.fromDate] : undefined);
  }
}
