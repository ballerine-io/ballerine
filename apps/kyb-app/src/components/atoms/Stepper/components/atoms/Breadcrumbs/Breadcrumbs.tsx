import { Item } from './Breadcrumbs.Item';
import { Label } from './Breadcrumbs.Label';
import { baseBreadcrumbTheme } from './theme/base-theme';
import { BreadcrumbItemRender, BreadcrumbsProps, BreadcrumbsRendererCallback } from './types';
import { useEffect, useMemo, useRef } from 'react';

export const Breadcrumbs = ({
  items,
  active,
  theme = baseBreadcrumbTheme,
  children: renderCallback,
}: BreadcrumbsProps) => {
  const renderCallbackRef = useRef<BreadcrumbsRendererCallback>(
    renderCallback as BreadcrumbsRendererCallback,
  );

  useEffect(() => {
    if (renderCallback) {
      renderCallbackRef.current = renderCallback;
    }
  }, [renderCallback]);

  const itemsProps: BreadcrumbItemRender[] = useMemo(
    () => items.map(item => ({ ...item, active: active?.id === item.id })),
    [items, active],
  );

  const children = useMemo(
    () => renderCallbackRef.current(itemsProps, theme),
    [renderCallbackRef, itemsProps, theme],
  );

  return <>{children}</>;
};

Breadcrumbs.Item = Item;
Breadcrumbs.Label = Label;
