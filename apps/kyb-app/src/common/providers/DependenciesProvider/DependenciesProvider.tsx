import { InvalidAccessTokenError } from '@/common/errors/invalid-access-token';
import { ServerNotAvailableError } from '@/common/errors/server-not-available';
import { queryClient } from '@/common/utils/query-client';
import {
  collectionFlowQuerykeys,
  fetchCustomer,
  fetchFlowContext,
  fetchUISchema,
} from '@/domains/collection-flow';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useEndUserQuery } from '@/hooks/useEndUserQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { useLanguage } from '@/hooks/useLanguage';
import { useRefValue } from '@/hooks/useRefValue';
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
  const { refetch: refetchEndUser, data: endUser } = useEndUserQuery();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const language = useLanguage();

  const dependancyQueries = [
    useCustomerQuery(),
    useFlowContextQuery(),
    useUISchemasQuery({ language }),
  ] as const satisfies readonly [
    ReturnType<typeof useCustomerQuery>,
    ReturnType<typeof useFlowContextQuery>,
    ReturnType<typeof useUISchemasQuery>,
  ];

  const queriesRef = useRefValue(dependancyQueries);

  const isFetching = useMemo(() => {
    return dependancyQueries.length
      ? dependancyQueries.some(dependency => dependency.isLoading)
      : false;
  }, [dependancyQueries]);

  const isLoading = useMemo(() => {
    return isInitialLoading && dependancyQueries.some(dependency => dependency.isLoading);
  }, [isInitialLoading, dependancyQueries]);

  useEffect(() => {
    if (isLoading) return;

    setIsInitialLoading(false);
  }, [isLoading]);

  const errors = useMemo(() => {
    return dependancyQueries.filter(dependency => dependency.error);
  }, [dependancyQueries]);

  const refetchAll = useCallback(async () => {
    const { data: endUser } = await refetchEndUser();

    const [uiSchema, customer, flowContext] = await Promise.all([
      fetchUISchema(language, endUser?.id),
      fetchCustomer(),
      fetchFlowContext(),
    ]);

    queryClient.setQueryData(
      collectionFlowQuerykeys.getUISchema({ language, endUserId: endUser?.id }).queryKey,
      uiSchema,
    );
    queryClient.setQueryData(collectionFlowQuerykeys.getCustomer().queryKey, customer);
    queryClient.setQueryData(collectionFlowQuerykeys.getContext().queryKey, flowContext);
  }, [refetchEndUser, language]);

  const context = useMemo(
    () => ({ refetchAll, isLoading, isFetching }),
    [refetchAll, isLoading, isFetching],
  );

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
  }, []);

  console.log({ error });

  if (error) {
    throw error;
  }

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return <DependenciesContext.Provider value={context}>{children}</DependenciesContext.Provider>;
};
