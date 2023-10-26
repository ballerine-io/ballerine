import { CustomerContext } from '@app/components/providers/CustomerProvider/types';
import { createContext } from 'react';

export const customerContext = createContext({} as CustomerContext);
