import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { CollectionFlowManager } from '@ballerine/common';

export const isPageCompleted = (page: UIPage, context: CollectionFlowContext) => {
  const collectionFlow = new CollectionFlowManager(context);

  const result = collectionFlow.state().isStepCompleted(page.stateName!);

  return result;
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

  if (pages[0]?.stateName === context.collectionFlow?.state?.uiState) return initialUIState;

  pages.forEach(page => {
    initialUIState.elements[page.stateName] = {
      isLoading: false,
      isTouched: false,
      isCompleted: isPageCompleted(page, context),
    };
  });

  return initialUIState;
};
