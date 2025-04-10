import { useCallback, useMemo, useState } from 'react';
import { GlobalUIStateContext, IGlobalUIState } from './GlobalUIState.context';

interface IGlobalUIStateProps {
  initialState?: IGlobalUIState;
  children: React.ReactNode;
}

const INITIAL_UI_STATE: IGlobalUIState = {
  isFinalSubmitted: false,
  isSyncing: false,
};

export const GlobalUIState = ({
  initialState = INITIAL_UI_STATE,
  children,
}: IGlobalUIStateProps) => {
  const [state, setState] = useState<IGlobalUIState>(() => initialState);

  const updateUIState = useCallback((state: Partial<IGlobalUIState>) => {
    setState(prev => ({ ...prev, ...state }));
  }, []);

  const setUIState = useCallback((state: IGlobalUIState) => {
    setState(state);
  }, []);

  const context = useMemo(
    () => ({ state, updateUIState, setUIState }),
    [state, updateUIState, setUIState],
  );

  return <GlobalUIStateContext.Provider value={context}>{children}</GlobalUIStateContext.Provider>;
};
