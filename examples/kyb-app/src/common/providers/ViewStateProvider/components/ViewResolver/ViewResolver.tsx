import { useViewState } from '@app/common/providers/ViewStateProvider/hooks/useViewState';
import { SchemaBase, SchemaStates } from '@app/common/providers/ViewStateProvider/types';
import { useMemo } from 'react';

interface Props<TSchema extends SchemaBase> {
  schema: TSchema;
  paths: Record<SchemaStates<TSchema>, React.ComponentType<object>>;
}

export function ViewResolver<TSchema extends SchemaBase>({ paths }: Props<TSchema>) {
  const context = useViewState();

  const Component = useMemo(() => {
    const componentInPaths = paths[context.state];

    if (!componentInPaths) return () => null;

    return componentInPaths;
  }, [paths, context.state]);

  return <Component />;
}
