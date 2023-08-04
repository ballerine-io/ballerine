import { JmesPathRule, JsonLogicRule } from './lib/rule-engine';
import { TCreateRuleEngine } from './lib/types';

export const createRuleEngine: TCreateRuleEngine = options => {
  if (options.Provider === 'jmespath')
    return {
      logicRule: (rule: any) => {
        return new JmesPathRule(rule);
      },
    };

  return {
    logicRule: (rule: any) => {
      return new JsonLogicRule(rule);
    },
  };
};
