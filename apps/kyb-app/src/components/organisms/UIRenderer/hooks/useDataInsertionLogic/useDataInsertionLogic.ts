import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useRulesTest } from '@/components/organisms/DynamicUI/hooks/useRuleTest';
import { JsonLogicRuleEngine } from '@/components/organisms/DynamicUI/rule-engines';
import { JmespathRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/jmespath.rule-engine';
import { JsonSchemaRuleEngine } from '@/components/organisms/DynamicUI/rule-engines/json-schema.rule-engine';
import { ArrayInsertionStrategy } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/array.insertion-strategy';
import { ObjectInsertionStrategy } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategies/object.insertion-strategy';
import { InsertStrategyRunner } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/insert-strategy-runner';
import { DefinitionInsertionParams } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/types';
import { useListElementsDisablerLogic } from '@/components/organisms/UIRenderer/hooks/useDataInsertionLogic/useElementsDisablerLogic';
import { UIElement } from '@/domains/collection-flow';
import { useRefValue } from '@/hooks/useRefValue';
import { useEffect, useMemo } from 'react';

export const useDataInsertionLogic = <TElementParams extends DefinitionInsertionParams>(
  definition: UIElement<TElementParams>,
  skip?: boolean,
) => {
  const { stateApi, payload } = useStateManagerContext();
  const isShouldInsert = useRulesTest(
    payload,
    definition?.options?.insertionParams?.insertWhen,
    false,
  );
  const isShouldRemove = useRulesTest(
    payload,
    definition?.options?.insertionParams?.removeWhen,
    false,
  );

  const disableElementsDefinitions = useMemo(
    () => definition.options?.insertionParams?.disableElements || [],
    [definition.options?.insertionParams?.disableElements],
  );

  const { disableElements, enableElements } = useListElementsDisablerLogic(
    disableElementsDefinitions,
  );
  const strategiesRunner = useMemo(
    () =>
      new InsertStrategyRunner(
        [new JsonLogicRuleEngine(), new JsonSchemaRuleEngine(), new JmespathRuleEngine()],
        [new ArrayInsertionStrategy(), new ObjectInsertionStrategy()],
      ),
    [],
  );

  const apiRef = useRefValue(stateApi);
  const disableElementsRef = useRefValue(disableElements);
  const enableElementsRef = useRefValue(enableElements);

  useEffect(() => {
    if (skip || !isShouldInsert) return;

    const runResult = strategiesRunner.runInsertion(
      apiRef.current.getContext(),
      definition.options.insertionParams,
    );
    apiRef.current.setContext(runResult);

    disableElementsRef.current();
  }, [
    isShouldInsert,
    apiRef,
    skip,
    strategiesRunner,
    definition?.options?.insertionParams,
    disableElementsRef,
  ]);

  useEffect(() => {
    if (skip || !isShouldRemove) return;

    const runResult = strategiesRunner.runRemoval(
      apiRef.current.getContext(),
      definition.options.insertionParams,
    );
    apiRef.current.setContext(runResult);
    enableElementsRef.current();
  }, [
    isShouldRemove,
    apiRef,
    skip,
    strategiesRunner,
    definition?.options?.insertionParams,
    enableElementsRef,
  ]);
};
