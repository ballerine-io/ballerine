import { ViewStateContext } from './types';
import { AnyObject } from '@ballerine/ui';
import { createContext } from 'react';

export const stateContext = createContext({} as ViewStateContext<AnyObject>);
