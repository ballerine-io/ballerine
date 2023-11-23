import { CustomerContext } from '@/components/providers/CustomerProvider/types';
import { createContext } from 'react';

export const customerContext = createContext({} as CustomerContext);
