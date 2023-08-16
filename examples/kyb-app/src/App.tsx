import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/common/utils/query-client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/router';
import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';

export const App = () => {
  // TO DO: on merge with DEMO branch update dependency list with customer information query
  const dependancyQueries = [useCollectionFlowSchemaQuery()];

  return (
    <AppLoadingContainer dependencies={dependancyQueries}>
      <RouterProvider router={router} />
    </AppLoadingContainer>
  );
};
2;
