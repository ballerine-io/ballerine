import { Injectable } from '@nestjs/common';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { BusinessRepository } from '@/business/business.repository';

@Injectable()
export class EntityRepository {
  constructor(
    private readonly endUserRepository: EndUserRepository,
    private readonly businessRepository: BusinessRepository,
  ) {}

  endUser = this.endUserRepository;
  business = this.businessRepository;
}
