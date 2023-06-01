import { Route } from '@tanstack/react-router';
import { queryClient } from '../../../lib/react-query/query-client';
import { individualsRoute } from 'components/pages/Individuals/Individuals.route';
import { Individual } from 'components/pages/Individual/Individual.page';
import { queries } from '../../../lib/react-query/queries';
import { auth } from '../../../lib/react-query/auth';
import { Alert } from 'components/atoms/Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertTitle } from 'components/atoms/Alert/Alert.Title';
import { AlertDescription } from 'components/atoms/Alert/Alert.Description';

// @ts-ignore
export const individualRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '$endUserId',
  onLoad: async ({ params, search }) => {
    const { endUserId } = params;
    const entityById = queries[search?.entity].byId(endUserId, search?.filterId);
    const getSession = auth.getSession();
    const session = queryClient.getQueryData<Awaited<ReturnType<typeof getSession.queryFn>>>(
      getSession.queryKey,
    );

    if (!session?.user) return;
    // TODO: Add workflowId to params/searchParams
    // const workflowById = workflows.byId({ workflowId });

    if (search?.filterId) {
      await queryClient.ensureQueryData(entityById.queryKey, entityById.queryFn);
    }

    // await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

    return {};
  },
  errorComponent: ({ error }) => (
    <div className={`mt-3 p-1`}>
      <Alert variant={`destructive`} className={`w-full max-w-lg`}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  ),
  component: Individual,
});
