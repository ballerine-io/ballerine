import { TContext } from '@/lib';
import { createRuleEngine } from '@ballerine/rules-engine-lib/src';

export class ViolationRulesetPlugin {
  async invoke(context: TContext) {
    // Import rules from somewhere
    // map rules to custom rule engine
    createRuleEngine({
      provider: 'custom',
      ruleset: { operator: 'or', rules: [] },
      context: {},
    });
    // aggregation violations
    // return violations
  }
}
