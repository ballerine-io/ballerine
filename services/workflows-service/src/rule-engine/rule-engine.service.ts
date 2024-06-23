import { Injectable } from '@nestjs/common';
import { RuleStoreService, RuleStoreServiceFindAllOptions } from './rule-store.service';
import { operationHelpers } from './core/operators/constants';
import { RuleEngine } from './core/rule-engine';

@Injectable()
export class RuleEngineService {
  constructor(private readonly ruleStoreService: RuleStoreService) {}

  public async run(storeOptions: RuleStoreServiceFindAllOptions, formData: object) {
    const rules = await this.ruleStoreService.findAll(storeOptions);

    const ruleEngine = RuleEngine(rules, operationHelpers);

    const output = ruleEngine.run(formData);

    return output;
  }
}
