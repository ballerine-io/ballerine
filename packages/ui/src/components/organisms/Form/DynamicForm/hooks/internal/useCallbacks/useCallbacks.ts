import { useDynamicForm } from '../../../context';

export const useCallbacks = () => {
  const { callbacks } = useDynamicForm();

  return callbacks;
};
