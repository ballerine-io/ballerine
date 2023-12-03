import { customerContext } from '@/components/providers/CustomerProvider/customer.context';
import { useContext } from 'react';

export const useCustomer = () => useContext(customerContext);
