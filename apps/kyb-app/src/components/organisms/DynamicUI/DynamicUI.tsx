import { PageResolver } from '@/components/organisms/DynamicUI/PageResolver';
import { StateManager } from '@/components/organisms/DynamicUI/StateManager/StateManager';
import { AnyChildren } from '@ballerine/ui';
import { dynamicUIContext } from './dynamic-ui.context';
import { useDynamicUIContextComposer } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContextComposer';
import { TransitionListener } from '@/components/organisms/DynamicUI/TransitionListener';
import { UIState } from '@/components/organisms/DynamicUI/hooks/useUIStateLogic/types';
import { Page } from '@/components/organisms/DynamicUI/Page';
import { ActionsHandler } from '@/components/organisms/DynamicUI/StateManager/components/ActionsHandler';

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
