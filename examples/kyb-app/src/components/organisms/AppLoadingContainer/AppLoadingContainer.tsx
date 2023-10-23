import { AppDependency } from '@app/components/organisms/AppLoadingContainer/types';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';
import { AnyChildren } from '@ballerine/ui';
import { useMemo } from 'react';

interface Props {
  dependencies: ReadonlyArray<AppDependency>;
  children: AnyChildren;
}

export const AppLoadingContainer = ({ dependencies, children }: Props) => {
  const isLoading = useMemo(() => {
    return dependencies.length ? dependencies.some(dependency => dependency.isLoading) : false;
  }, [dependencies]);

  return isLoading ? <LoadingScreen /> : <>{children}</>;
};
