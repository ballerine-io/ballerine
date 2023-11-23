import { StateManagerContext } from '@/components/organisms/DynamicUI/StateManager/types';
import { AnyChildren } from '@ballerine/ui';
import { stateContext } from './state.context';

const { Provider } = stateContext;

interface Props {
  context: StateManagerContext;
  children: AnyChildren;
}

export const StateProvider = ({ context, children }: Props) => {
  return <Provider value={context}>{children}</Provider>;
};
