import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { getAllDefinitions } from '@/components/organisms/UIRenderer/elements/JSONForm/helpers/findDefinitionByName';
import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import get from 'lodash/get';

const isPageCompleted = (page: UIPage, context: CollectionFlowContext) => {
  const pageElements = getAllDefinitions(page.elements);

  for (const element of pageElements) {
    //@ts-ignore
    const existingValue = get(context, element.valueDestination);

    if (existingValue) return true;
  }

  return false;
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
