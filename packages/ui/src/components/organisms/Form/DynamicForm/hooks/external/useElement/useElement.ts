import { useRuleEngine } from '@/components/organisms/Form/hooks/useRuleEngine';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useElementId } from '../useElementId';
import { useClearValueOnUnmount } from './hooks/useClearValueOnUnmount';

export const useElement = <TElements extends string, TParams>(
  element: IFormElement<TElements, TParams>,
  stack: TDeepthLevelStack = [],
) => {
  const { values } = useDynamicForm();
  const hiddenRulesResult = useRuleEngine(values, {
    rules: element.hidden,
    runOnInitialize: true,
    executionDelay: 500,
  });

  const isHidden = useMemo(() => {
    if (!hiddenRulesResult.length) return false;

    return hiddenRulesResult.every(result => result.result === true);
  }, [hiddenRulesResult]);

  useClearValueOnUnmount(element, isHidden);

  return {
    id: useElementId(element, stack),
    originId: element.id,
    hidden: isHidden,
  };
};
