import { useUIStateLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { DynamicUIContext } from '@app/components/organisms/DynamicUI/types';
import { useMemo } from 'react';

export const useDynamicUIContextComposer = (initialState?: UIState): DynamicUIContext => {
  const { uiState, setUIElementState, setLoading, overrideUIState } = useUIStateLogic(initialState);

  const context: DynamicUIContext = useMemo(() => {
    const ctx: DynamicUIContext = {
      state: uiState,
      helpers: {
        setUIElementState,
        setLoading,
        overrideState: overrideUIState,
      },
    };

    return ctx;
  }, [uiState, setUIElementState, setLoading, overrideUIState]);

  return context;
};
