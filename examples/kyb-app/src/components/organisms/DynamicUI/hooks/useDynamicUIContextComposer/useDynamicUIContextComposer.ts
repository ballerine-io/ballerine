import { useUIStateLogic } from '@app/components/organisms/DynamicUI/hooks/useUIStateLogic';
import { DynamicUIContext } from '@app/components/organisms/DynamicUI/types';
import { useMemo } from 'react';

export const useDynamicUIContextComposer = (): DynamicUIContext => {
  const { uiState, setUIElementState } = useUIStateLogic();

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
