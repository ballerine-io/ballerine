import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUIRenderer/engines/json-logic.rule-engine';
import { RuleEngine } from '@app/components/organisms/DynamicUIRenderer/engines/rule-engine.abstract';

export const ruleEngines: RuleEngine[] = [new JsonLogicRuleEngine()];
