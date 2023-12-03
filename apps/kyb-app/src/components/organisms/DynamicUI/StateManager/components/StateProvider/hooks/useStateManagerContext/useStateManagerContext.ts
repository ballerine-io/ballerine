import { stateContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider/state.context';
import { useContext } from 'react';

export const useStateManagerContext = () => useContext(stateContext);
