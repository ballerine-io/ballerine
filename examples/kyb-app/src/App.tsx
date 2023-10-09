import '@ballerine/ui/dist/style.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/router';
import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { CustomerProvider } from '@app/components/providers/CustomerProvider';
import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';
import { useCustomerQuery } from '@app/hooks/useCustomerQuery';

export const App = () => {
  const dependancyQueries = [useCollectionFlowSchemaQuery(), useCustomerQuery()];

  return (
    <AppLoadingContainer dependencies={dependancyQueries}>
      <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
        <RouterProvider router={router} />
      </CustomerProvider>
    </AppLoadingContainer>
  );
};
