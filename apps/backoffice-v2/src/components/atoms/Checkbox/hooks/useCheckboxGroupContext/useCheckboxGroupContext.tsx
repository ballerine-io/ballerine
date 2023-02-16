import { useContext } from 'react';
import { Context } from '../../context';

/**
 * @description Provides access to the context's state and actions, checks if the provider is in use.
 */
export const useCheckboxGroupContext = () => {
  const value = useContext(Context);

  if (!value) {
    throw new Error(
      'useCheckboxGroupContext must be used within a CheckboxGroupContext. Did you forget to use the Checkbox.Group component?',
    );
  }

  return value;
};
