import { InvalidAccessTokenError } from '@/common/errors/invalid-access-token';
import { ServerNotAvailableError } from '@/common/errors/server-not-available';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useEndUserQuery } from '@/hooks/useEndUserQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { LoadingScreen } from '@/pages/CollectionFlow/components/atoms/LoadingScreen';
import { HTTPError } from 'ky';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { DependenciesContext } from './dependencies-context';
import { getJsonErrors, isShouldIgnoreErrors } from './helpers';

interface IDependenciesProviderProps {
  children: React.ReactNode;
}

export const DependenciesProvider: FunctionComponent<IDependenciesProviderProps> = ({
  children,
}: IDependenciesProviderProps) => {
  const [error, setError] = useState<Error | null>(null);
  const { refetch: refetchEndUser } = useEndUserQuery();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const language = useLanguage();

  const dependancyQueries = [
    useCustomerQuery(),
    useFlowContextQuery(),
    useUISchemasQuery(language),
  ] as const satisfies readonly [
    ReturnType<typeof useCustomerQuery>,
    ReturnType<typeof useFlowContextQuery>,
    ReturnType<typeof useUISchemasQuery>,
  ];

  const isLoading = useMemo(() => {
    return dependancyQueries.length
      ? dependancyQueries.some(dependency => dependency.isLoading && !dependency.isLoaded)
      : false;
  }, [dependancyQueries]);

  useEffect(() => {
    if (isLoading) return;

    setIsInitialLoading(false);
  }, [isLoading]);

  const errors = useMemo(() => {
    return dependancyQueries.filter(dependency => dependency.error);
  }, [dependancyQueries]);

  const refetchAll = useCallback(async () => {
    await refetchEndUser(); // It will trigger refetch of all dependencies
  }, [refetchEndUser]);

  const context = useMemo(() => ({ refetchAll, isLoading }), [refetchAll, isLoading]);

  useEffect(() => {
    if (!Array.isArray(errors) || !errors?.length) return;

    const handleErrors = async (errors: HTTPError[]) => {
      // If there is no response, it means that the server is not available
      if (errors.every(error => !error.response)) {
        setError(new ServerNotAvailableError());

        return;
      }

      const isShouldIgnore = await isShouldIgnoreErrors(errors);

      if (isShouldIgnore) return;

      const errorResponses = await getJsonErrors(errors);

      if (errorResponses.every(error => error.statusCode === 401)) {
        setError(new InvalidAccessTokenError());

        return;
      }

      setError(new Error('Something went wrong'));
    };

    void handleErrors(errors.map(error => error.error) as HTTPError[]);
  }, [errors]);

  if (error) {
    throw error;
  }

  if (isInitialLoading) {
    return <LoadingScreen isLoading={isInitialLoading} />;
  }

  return <DependenciesContext.Provider value={context}>{children}</DependenciesContext.Provider>;
};
