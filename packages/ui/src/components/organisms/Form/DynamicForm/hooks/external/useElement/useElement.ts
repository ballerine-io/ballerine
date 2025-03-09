import { AnyObject } from '@/common';
import { useRuleEngine } from '@/components/organisms/Form/hooks/useRuleEngine';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { usePriorityFields } from '../../internal/usePriorityFields';
import { useElementId } from '../useElementId';
import { useRules } from '../useRules';
import { useClearValueOnUnmount } from './hooks/useClearValueOnUnmount';

export const useElement = <TElements extends string, TParams>(
  element: IFormElement<TElements, TParams>,
  stack?: TDeepthLevelStack,
  elementState?: AnyObject,
) => {
  const { values, metadata } = useDynamicForm();
  const valuesAndMetadata = useMemo(
    () => ({ ...values, ...metadata, $this: elementState }),
    [values, metadata, elementState],
  );
  const hiddenRulesResult = useRuleEngine(valuesAndMetadata, {
    rules: useRules(element.hidden, stack),
    runOnInitialize: true,
    executeRulesSync: true,
  });

  const isHidden = useMemo(() => {
    if (!hiddenRulesResult.length) {
      return false;
    }

    return hiddenRulesResult.some(result => result.result === true);
  }, [hiddenRulesResult]);

  useClearValueOnUnmount(element, isHidden);

  return {
    id: useElementId(element, stack),
    originId: element.id,
    hidden: usePriorityFields(element).isShouldHidePriorityField || isHidden,
  };
};
