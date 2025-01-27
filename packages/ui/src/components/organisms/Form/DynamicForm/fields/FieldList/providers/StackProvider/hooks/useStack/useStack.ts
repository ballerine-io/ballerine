import { useContext } from 'react';
import { StackProviderContext } from '../../context/stack-provider-context';

export const useStack = () => useContext(StackProviderContext);
