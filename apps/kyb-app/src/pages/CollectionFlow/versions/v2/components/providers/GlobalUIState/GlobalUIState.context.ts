import { createContext } from 'react';

export interface IGlobalUIState {
  isFinalSubmitted: boolean;
  isSyncing: boolean;
}

export interface IGlobalUIContext {
  state: IGlobalUIState;
  updateUIState: (state: Partial<IGlobalUIState>) => void;
  setUIState: (state: IGlobalUIState) => void;
}

export const GlobalUIStateContext = createContext<IGlobalUIContext>({
  state: {} as IGlobalUIState,
  updateUIState: () => undefined,
  setUIState: () => undefined,
});
