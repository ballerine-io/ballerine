import { UIElementsState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';

export interface UIState {
  isLoading: boolean;
  isRevision?: boolean;
  elements: UIElementsState;
}
