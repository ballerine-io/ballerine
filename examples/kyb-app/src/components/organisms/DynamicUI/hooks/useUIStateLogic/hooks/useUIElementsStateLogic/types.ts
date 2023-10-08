export interface UIElementState {
  isLoading: boolean;
}

export interface UIElementsState {
  [id: string]: UIElementState;
}

export type UIElementStateSetter = (elementId: string, state: UIElementState) => void;
