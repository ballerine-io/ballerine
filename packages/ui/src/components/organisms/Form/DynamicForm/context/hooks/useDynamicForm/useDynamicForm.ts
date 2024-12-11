import { useContext } from 'react';
import { DynamicFormContext } from '../../dynamic-form.context';

export const useDynamicForm = () => useContext(DynamicFormContext);
