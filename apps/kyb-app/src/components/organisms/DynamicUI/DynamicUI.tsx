import { useDynamicUIContextComposer } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContextComposer';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { Page } from '@/components/organisms/DynamicUI/Page';
import { PageResolver } from '@/components/organisms/DynamicUI/PageResolver';
import { ActionsHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler';
import { StateManager } from '@/components/organisms/DynamicUI/StateManager/StateManager';
import { TransitionListener } from '@/components/organisms/DynamicUI/TransitionListener';
import { AnyChildren } from '@ballerine/ui';
import { dynamicUIContext } from './dynamic-ui.context';

const { Provider } = dynamicUIContext;

export interface DynamicUIProps {
  children: AnyChildren;
  initialState?: UIState;
}

export const DynamicUI = ({ children, initialState }: DynamicUIProps) => {
  const context = useDynamicUIContextComposer(initialState);

  return <Provider value={context}>{children}</Provider>;
};

DynamicUI.StateManager = StateManager;
DynamicUI.PageResolver = PageResolver;
DynamicUI.TransitionListener = TransitionListener;
DynamicUI.Page = Page;
DynamicUI.ActionsHandler = ActionsHandler;
