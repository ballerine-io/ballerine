import { useCurrentPageElement } from '@app/components/organisms/DynamicUI/PageResolver/hooks/useCurrentPageElement';
import {
  PageResolverContext,
  PageResolverProps,
} from '@app/components/organisms/DynamicUI/PageResolver/types';
import { pageResolverContext } from './page-resolver.context';
import { useMemo } from 'react';

const { Provider } = pageResolverContext;

export const PageResolver = ({ state, pages, children }: PageResolverProps) => {
  const currentPage = useCurrentPageElement(state, pages);

  const context: PageResolverContext = useMemo(
    () => ({ currentPage, pages }),
    [currentPage, pages],
  );

  const child = useMemo(
    () => (typeof children === 'function' ? children(context) : children),
    [children, context],
  );

  return <Provider value={context}>{child}</Provider>;
};
