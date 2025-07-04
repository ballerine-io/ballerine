import { TUIElement } from '@ballerine/common';
import { useMemo } from 'react';

export const useChildrenDisabledOnLock = (element: TUIElement, isLocked: boolean) => {
  const { children: _children } = element;

  const children = useMemo(() => {
    if (!isLocked) {
      return _children;
    }

    const lockChildren = (children: TUIElement[]) => {
      return children.map(child => {
        const element = {
          ...child,
          disable: [
            ...(child.disable || []),
            {
              engine: 'json-logic' as const,
              value: {
                '==': [1, 1],
              },
            },
          ],
        };

        if (element.children) {
          element.children = lockChildren(element.children);
        }

        return element;
      });
    };

    return lockChildren(_children || []);
  }, [_children, isLocked]);

  return children;
};
