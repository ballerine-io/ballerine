import { useViewState } from '@app/common/providers/ViewStateProvider/hooks/useViewState';
import { useMemo } from 'react';

interface Props {
  paths: Record<PropertyKey, React.ComponentType<object>>;
}

export function ViewResolver({ paths }: Props) {
  const context = useViewState();

  const Component = useMemo(() => {
    const componentInPaths = paths[context.state as PropertyKey];

    if (!componentInPaths) return () => null;

    return componentInPaths;
  }, [paths, context.state]);

  return <Component />;
}
