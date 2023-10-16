export interface UIElementState {
  isLoading: boolean;
  isCompleted: boolean;
}

export interface UIElementsState {
  [id: string]: UIElementState;
}

export type UIElementStateSetter = (elementId: string, state: UIElementState) => void;
export type UIElementCompletionSetter = (elementId: string, completed: boolean) => void;
export type UILoadingSetter = (loading: boolean) => void;
