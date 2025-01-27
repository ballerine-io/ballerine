import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { InvalidAccessTokenError } from '@/common/errors/invalid-access-token';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { HTTPError } from 'ky';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { getJsonErrors, isShouldIgnoreErrors } from './helpers';

interface IDependenciesProviderProps {
  children: React.ReactNode;
}

export const DependenciesProvider: FunctionComponent<IDependenciesProviderProps> = ({
  children,
}: IDependenciesProviderProps) => {
  const [error, setError] = useState<Error | null>(null);

  const dependancyQueries = [
    useCustomerQuery(),
    useFlowContextQuery(),
  ] as const satisfies readonly [
    ReturnType<typeof useCustomerQuery>,
    ReturnType<typeof useFlowContextQuery>,
  ];

  const isLoading = useMemo(() => {
    return dependancyQueries.length
      ? dependancyQueries.some(dependency => dependency.isLoading && !dependency.isLoaded)
      : false;
  }, [dependancyQueries]);

  const errors = useMemo(() => {
    return dependancyQueries.filter(dependency => dependency.error);
  }, [dependancyQueries]);

  useEffect(() => {
    if (!Array.isArray(errors) || !errors?.length) return;

    const handleErrors = async (errors: HTTPError[]) => {
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    throw error;
  }

  return <>{children}</>;
};
