import { createContext } from 'react';
import { TImageViewerState } from './types';

/**
 * When context is undefined we know that we are outside of the provider.
 */
export const Context = createContext<TImageViewerState>(undefined);
