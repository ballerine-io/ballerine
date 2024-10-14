import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useUIElementToolsLogic } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { UIPage } from '@/domains/collection-flow';
import { useRefValue } from '@/hooks/useRefValue';
import { AnyChildren } from '@ballerine/ui';
import { useEffect, useRef } from 'react';

export interface TransitionListenerTools {
  setElementCompleted: (elementId: string, completed: boolean) => void;
}

export interface TransitionListenerProps {
  onPrevious?: (tools: TransitionListenerTools, prevState: string, currentState: string) => void;
  onNext?: (tools: TransitionListenerTools, prevState: string, currentState: string) => void;
  onFinish?: (tools: TransitionListenerTools, currentState: string) => void;
  pages: UIPage[];
  children: AnyChildren | ((tools: TransitionListenerTools) => AnyChildren);
}

export const TransitionListener = ({
  onPrevious,
  onNext,
  onFinish,
  children,
  pages,
}: TransitionListenerProps) => {
  const { state } = useStateManagerContext();
  const { setElementCompleted } = useUIElementToolsLogic('');

  const prevStateRef = useRef(state);
  const helpersRef = useRefValue(setElementCompleted);

  useEffect(() => {
    const currentPageIndex = pages.findIndex(page => page.stateName === state);
    const prevPageIndex = pages.findIndex(page => page.stateName === prevStateRef.current);

    if (currentPageIndex < prevPageIndex) {
      onPrevious &&
        onPrevious({ setElementCompleted: helpersRef.current }, prevStateRef.current, state);
    }

    if (currentPageIndex > prevPageIndex) {
      onNext && onNext({ setElementCompleted: helpersRef.current }, prevStateRef.current, state);
    }

    if (currentPageIndex !== -1) {
      prevStateRef.current = state;
    }
  }, [prevStateRef, helpersRef, state, pages]);

  useEffect(() => {
    const currentPageIndex = pages.findIndex(page => page.stateName === state);

    if (currentPageIndex === -1 && state === 'finish') {
      onFinish && onFinish({ setElementCompleted: helpersRef.current }, prevStateRef.current);
    }
  }, [state, pages, helpersRef, prevStateRef]);

  return <>{typeof children === 'function' ? children({ setElementCompleted }) : children}</>;
};
