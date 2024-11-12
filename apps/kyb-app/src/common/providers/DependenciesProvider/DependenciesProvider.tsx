import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { LoadingScreen } from '@/pages/CollectionFlow/components/atoms/LoadingScreen';
import { FunctionComponent, useMemo } from 'react';

interface IDependenciesProviderProps {
  children: React.ReactNode;
}

export const DependenciesProvider: FunctionComponent<IDependenciesProviderProps> = ({
  children,
}: IDependenciesProviderProps) => {
  const language = useLanguage();

  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(language),
    useFlowContextQuery(),
  ] as const;

  const isLoading = useMemo(() => {
    return dependancyQueries.length
      ? dependancyQueries.some(dependency => dependency.isLoading)
      : false;
  }, [dependancyQueries]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
