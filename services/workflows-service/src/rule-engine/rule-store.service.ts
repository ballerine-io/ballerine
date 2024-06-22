import { Injectable } from '@nestjs/common';
import { RuleSet } from './core/types';

export type RuleStoreServiceFindAllOptions = {
  databaseId: string;
  source: 'notion';
};

@Injectable()
export class RuleStoreService {
  constructor() {}

  public async findAll({ databaseId, source }: RuleStoreServiceFindAllOptions): Promise<RuleSet> {
    throw new Error('Unsupported source');
  }
}
