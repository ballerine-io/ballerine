import { IFormElement, TDeepthLevelStack, useElement } from '@ballerine/ui';

interface IElementContainerProps {
  element: IFormElement<any, any>;
  stack?: TDeepthLevelStack;
  children: React.ReactNode;
}

export const ElementContainer: React.FC<IElementContainerProps> = ({
  children,
  element,
  stack,
}) => {
  const { hidden } = useElement(element, stack);

  if (hidden) {
    return null;
  }

  return <>{children}</>;
};
