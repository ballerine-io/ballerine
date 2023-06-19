import * as jsonLogic from 'json-logic-js';

export interface RuleEngineOptions {
  Provider: 'json-logic' | 'json-rule-engine';
}

export interface RuleEngine {
  logicRule: (rule: any) => LogicRule;
  // logicRuleSet: [JsonLogicRule];
  // aiRule: (network: any) => void;
}

export interface LogicRule {
  evaluate: (data: any) => boolean;
}

export class JsonLogicRule {
  #__rule: any;
  constructor(rule: any) {
    this.#__rule = rule;
  }

  evaluate(data: any) {
    return jsonLogic.apply(
      this.#__rule, // Rule
      data, // Data
    );
  }
}
