import {
  UIElementStateSetter,
  UILoadingSetter,
  UIStateSetter,
} from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/hooks/useUIElementsStateLogic/types';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';

export interface DynamicUIContext {
  state: UIState;
  helpers: {
    setUIElementState: UIElementStateSetter;
    setLoading: UILoadingSetter;
    overrideState: UIStateSetter;
  };
}
