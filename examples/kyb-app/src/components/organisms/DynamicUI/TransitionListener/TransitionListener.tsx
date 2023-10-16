import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useUIElementToolsLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/hooks/useUIElementToolsLogic';
import { AnyChildren } from '@ballerine/ui';
import { useEffect, useRef } from 'react';

export interface TransitionListenerTools {
  setElementCompleted: (elementId: string, completed: boolean) => void;
}

export interface TransitionListenerProps {
  onPrevious?: (tools: TransitionListenerTools, prevState: string, currentState: string) => void;
  onNext?: (tools: TransitionListenerTools, prevState: string, currentState: string) => void;
  children: AnyChildren;
}

export const TransitionListener = ({ onPrevious, onNext, children }: TransitionListenerProps) => {
  const { state } = useStateManagerContext();
  const { pages } = usePageResolverContext();
  const { setElementCompleted } = useUIElementToolsLogic('');

  const prevStateRef = useRef(state);
  const helpersRef = useRef({ setElementCompleted });

  useEffect(() => {
    helpersRef.current = {
      setElementCompleted,
    };
  }, [setElementCompleted]);

  useEffect(() => {
    const currentPageIndex = pages.findIndex(page => page.stateName === state);
    const prevPageIndex = pages.findIndex(page => page.stateName === prevStateRef.current);

    if (currentPageIndex < prevPageIndex) {
      onPrevious && onPrevious(helpersRef.current, prevStateRef.current, state);
    }

    if (currentPageIndex > prevPageIndex) {
      onNext && onNext(helpersRef.current, prevStateRef.current, state);
    }

    prevStateRef.current = state;
  }, [prevStateRef, helpersRef, state, pages]);

  return <>{children}</>;
};
