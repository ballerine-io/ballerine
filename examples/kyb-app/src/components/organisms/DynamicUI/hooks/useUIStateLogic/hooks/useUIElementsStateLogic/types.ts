import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';

export interface UIElementState {
  isLoading?: boolean;
  isCompleted?: boolean;
  isTouched?: boolean;
}

export interface UIElementsState {
  [id: string]: UIElementState;
}

export type UIElementStateSetter = (elementId: string, state: UIElementState) => void;
export type UIElementsStateSetter = (state: UIElementsState) => void;
export type UIElementCompletionSetter = (elementId: string, completed: boolean) => void;
export type UILoadingSetter = (loading: boolean) => void;
export type UIStateSetter = (state: UIState) => void;
