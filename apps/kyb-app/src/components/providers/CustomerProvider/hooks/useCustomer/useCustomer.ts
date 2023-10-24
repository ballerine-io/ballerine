import { customerContext } from '@app/components/providers/CustomerProvider/customer.context';
import { useContext } from 'react';

export const useCustomer = () => useContext(customerContext);
