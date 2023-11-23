import { UIElementsState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';

export interface UIState {
  isLoading: boolean;
  elements: UIElementsState;
}
