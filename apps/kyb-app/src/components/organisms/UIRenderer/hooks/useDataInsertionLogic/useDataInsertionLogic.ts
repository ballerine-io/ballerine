import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { JsonLogicRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines';
import { JmespathRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonSchemaRuleEngine } from '@app/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { ArrayInsertionStrategy } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/array.insertion-strategy';
import { ObjectInsertionStrategy } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/object.insertion-strategy';
import { InsertStrategyRunner } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategy-runner';
import { DefinitionInsertionParams } from '@app/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { UIElement } from '@app/domains/collection-flow';
import debounce from 'lodash/debounce';
import { useEffect, useMemo } from 'react';

export const useDataInsertionLogic = <TElementParams extends DefinitionInsertionParams>(
  definition: UIElement<TElementParams>,
  skip?: boolean,
) => {
  const { stateApi, payload } = useStateManagerContext();
  const strategiesRunner = useMemo(
    () =>
      new InsertStrategyRunner(
        [new JsonLogicRuleEngine(), new JsonSchemaRuleEngine(), new JmespathRuleEngine()],
        [new ArrayInsertionStrategy(), new ObjectInsertionStrategy()],
      ),
    [],
  );

  const runStrategyAsync = useMemo(
    () =>
      debounce((context: unknown) => {
        const strategyRunResult = strategiesRunner.run(context, definition.options.insertionParams);
        if (strategyRunResult === context) return;

        stateApi.setContext(strategyRunResult);
      }),
    [definition, strategiesRunner],
  );

  useEffect(() => {
    if (skip) return;

    runStrategyAsync(payload);
  }, [payload, runStrategyAsync, skip]);
};
