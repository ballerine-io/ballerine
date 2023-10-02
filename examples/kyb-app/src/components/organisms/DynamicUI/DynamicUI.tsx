import { PageResolver } from '@app/components/organisms/DynamicUI/PageResolver';
import { StateManager } from '@app/components/organisms/DynamicUI/StateManager/StateManager';
import { AnyChildren } from '@ballerine/ui';

export interface DynamicUIProps {
  children: AnyChildren;
}

export const DynamicUI = ({ children }: DynamicUIProps) => {
  return <>{children}</>;
};

DynamicUI.StateManager = StateManager;
DynamicUI.PageResolver = PageResolver;
