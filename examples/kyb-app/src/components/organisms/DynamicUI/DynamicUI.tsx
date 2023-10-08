import { PageResolver } from '@app/components/organisms/DynamicUI/PageResolver';
import { StateManager } from '@app/components/organisms/DynamicUI/StateManager/StateManager';
import { AnyChildren } from '@ballerine/ui';
import { dynamicUIContext } from './dynamic-ui.context';
import { useDynamicUIContextComposer } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContextComposer';

const { Provider } = dynamicUIContext;

export interface DynamicUIProps {
  children: AnyChildren;
}

export const DynamicUI = ({ children }: DynamicUIProps) => {
  const context = useDynamicUIContextComposer();

  return <Provider value={context}>{children}</Provider>;
};

DynamicUI.StateManager = StateManager;
DynamicUI.PageResolver = PageResolver;
