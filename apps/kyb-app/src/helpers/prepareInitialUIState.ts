import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';

export const isPageCompleted = (page: UIPage, context: CollectionFlowContext) => {
  return context?.flowConfig?.stepsProgress?.[page.stateName]?.isCompleted;
};

export const prepareInitialUIState = (
  pages: UIPage[],
  context: CollectionFlowContext,
  isRevision?: boolean,
): UIState => {
  const initialUIState: UIState = {
    isLoading: false,
    isRevision,
    elements: {},
  };
  if (pages[0]?.stateName === context.state) return initialUIState;

  pages.forEach(page => {
    initialUIState.elements[page.stateName] = {
      isLoading: false,
      isTouched: false,
      isCompleted: isPageCompleted(page, context),
    };
  });

  return initialUIState;
};
