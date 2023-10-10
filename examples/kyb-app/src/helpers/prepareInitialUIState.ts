import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { UIPage } from '@app/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

export const prepareInitialUIState = (pages: UIPage[], context: AnyObject): UIState => {
  const initialUIState: UIState = {
    isLoading: false,
    elements: {},
  };
  if (pages[0]?.stateName === context.state) return initialUIState;

  const currentPageIndex = pages.findIndex(page => page.stateName === context.state);

  pages.forEach((page, index) => {
    if (index <= currentPageIndex) {
      initialUIState.elements[page.stateName] = {
        isLoading: false,
        isCompleted: true,
      };
    }
  });

  return initialUIState;
};
