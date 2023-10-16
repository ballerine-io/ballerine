import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicElements/engines/json-logic.rule-engine';
import { RuleEngine } from '@app/components/organisms/DynamicElements/engines/rule-engine.abstract';

export const ruleEngines: RuleEngine[] = [new JsonLogicRuleEngine()];
