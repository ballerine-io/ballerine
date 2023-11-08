import { EngineManager } from '@app/components/organisms/DynamicUI/StateManager/components/ActionsHandler/helpers/engine-manager';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines';
import { DocumentsRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/documents.rule-engine';
import { JmespathRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { Rule } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';
import { useEffect, useMemo, useState } from 'react';

export const useRulesTest = (context: AnyObject, rules: Rule[], initialResult: boolean) => {
  const [executionResult, setExecutionResult] = useState<boolean>(initialResult);

  const rulesManager = useMemo(
    () =>
      new EngineManager([
        new JsonLogicRuleEngine(),
        new JsonSchemaRuleEngine(),
        new JmespathRuleEngine(),
        new DocumentsRuleEngine(),
      ]),
    [],
  );

  const executeRules = useMemo(
    () => (context: AnyObject, rules: Rule[]) => {
      const executionResult =
        rules?.map(rule => {
          const engine = rulesManager.getEngine(rule.type);

          return engine.test(context, rule);
        }) || [];

      setExecutionResult(executionResult.length ? executionResult.every(Boolean) : false);
    },
    [rulesManager],
  );

  useEffect(() => {
    executeRules(context, rules);
  }, [context, rules, executeRules]);

  return executionResult;
};
