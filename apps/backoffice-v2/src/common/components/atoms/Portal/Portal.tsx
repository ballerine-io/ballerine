import { FunctionComponentWithChildren } from '@ballerine/ui';
import { createPortal } from 'react-dom';

export const Portal: FunctionComponentWithChildren<{
  target: Parameters<typeof createPortal>[1];
}> = ({ children, target }) => {
  return createPortal(children, target);
};
