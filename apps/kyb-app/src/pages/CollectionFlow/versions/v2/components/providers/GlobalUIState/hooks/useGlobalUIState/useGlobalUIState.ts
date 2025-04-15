import { useContext } from 'react';
import { GlobalUIStateContext } from '../../GlobalUIState.context';

export const useGlobalUIState = () => useContext(GlobalUIStateContext);
