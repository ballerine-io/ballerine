import { Injectable } from '@nestjs/common';
import { RuleStoreService, RuleStoreServiceFindAllOptions } from './rule-store.service';
import { conditionHelpers } from './core/condition/constants';
import { RuleEngine } from './core/engine';
import { RuleSet } from './core/types';

@Injectable()
export class RuleEngineService {
  constructor(private readonly ruleStoreService: RuleStoreService) {}

  public async run(storeOptions: RuleStoreServiceFindAllOptions, formData: object) {
    const rules = await this.ruleStoreService.findAll(storeOptions);

    const ruleEngine = RuleEngine(rules, conditionHelpers);

    const output = ruleEngine.run(formData);

    return output;
  }

  validateRules(rules: RuleSet) {}
}
