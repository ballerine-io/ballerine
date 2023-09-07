import { FunctionComponent, PropsWithChildren } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

/**
 * @description To be used by {@link Cases}. Uses a ul element to display a list of cases.
 *
 * @param props
 * @param props.children - Expects {@link Cases.Item} components.
 * @constructor
 */
export const List: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [parent] = useAutoAnimate<HTMLUListElement>();

  return (
    <ul className={`menu gap-3`} ref={parent}>
      {children}
    </ul>
  );
};
