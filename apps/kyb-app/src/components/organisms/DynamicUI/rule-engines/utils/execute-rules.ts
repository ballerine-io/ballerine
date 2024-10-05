import { DocumentsRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/documents.rule-engine';
import { IsStepValidRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/is-step-valid.rule-engine';
import { JmespathRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-logic.rule-engine';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { EngineManager } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { Rule } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

const rulesManages = new EngineManager([
  new JsonLogicRuleEngine(),
  // @ts-ignore
  new JsonSchemaRuleEngine(),
  new JmespathRuleEngine(),
  new IsStepValidRuleEngine(),
  new DocumentsRuleEngine(),
]);

export const executeRule = (context: AnyObject, rule: Rule, ...rest: any[]) => {
  const engine = rulesManages.getEngine(rule.type);

  //@ts-ignore
  return engine?.validate.apply(engine, [context, rule, ...rest]);
};

export const testRule = (context: AnyObject, rule: Rule) => {
  const engine = rulesManages.getEngine(rule.type);

  return engine?.test(context, rule);
};
