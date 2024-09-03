import { useCurrentPageElement } from '@/components/organisms/DynamicUI/PageResolver/hooks/useCurrentPageElement';
import {
  PageResolverContext,
  PageResolverProps,
} from '@/components/organisms/DynamicUI/PageResolver/types';
import { useMemo } from 'react';
import { pageResolverContext } from './page-resolver.context';

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
