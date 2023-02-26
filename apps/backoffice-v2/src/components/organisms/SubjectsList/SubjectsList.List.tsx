import { FunctionComponent, PropsWithChildren } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

/**
 * @description To be used by {@link SubjectsList}. Uses a ul element to display a list of subjects.
 *
 * @param props
 * @param props.children - Expects {@link SubjectsList.Item} components.
 * @constructor
 */
export const List: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [parent] = useAutoAnimate<HTMLUListElement>();

  return (
    <ul className={`menu`} ref={parent}>
      {children}
    </ul>
  );
};
