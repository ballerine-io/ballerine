import { Injectable } from '@nestjs/common';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { BusinessRepository } from '@/business/business.repository';

@Injectable()
export class EntityRepository {
  constructor(
    public readonly endUser: EndUserRepository,
    public readonly business: BusinessRepository,
  ) {}
}
