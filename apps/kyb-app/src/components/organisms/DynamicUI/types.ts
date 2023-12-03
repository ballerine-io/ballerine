import {
  UIElementStateSetter,
  UILoadingSetter,
  UIStateSetter,
} from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';

export interface DynamicUIContext {
  state: UIState;
  helpers: {
    setUIElementState: UIElementStateSetter;
    setLoading: UILoadingSetter;
    overrideState: UIStateSetter;
  };
}
