import { useRuleEngine } from '@/components/organisms/Form/hooks/useRuleEngine';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { useMemo } from 'react';
import { useDynamicForm } from '../../../context';
import { IFormElement } from '../../../types';
import { useElementId } from '../useElementId';

export const useElement = <TElements, TParams>(
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

  return {
    id: useElementId(element, stack),
    originId: element.id,
    hidden: isHidden,
  };
};
