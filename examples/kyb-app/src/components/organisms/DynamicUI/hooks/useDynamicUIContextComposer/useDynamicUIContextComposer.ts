import { useUIStateLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic';
import { UIState } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { DynamicUIContext } from '@app/components/organisms/DynamicUI/types';
import { useMemo } from 'react';

export const useDynamicUIContextComposer = (initialState?: UIState): DynamicUIContext => {
  const { uiState, setUIElementState } = useUIStateLogic(initialState);

  const context: DynamicUIContext = useMemo(() => {
    const ctx: DynamicUIContext = {
      state: uiState,
      helpers: {
        setUIElementState,
      },
    };

    return ctx;
  }, [uiState, setUIElementState]);

  return context;
};
