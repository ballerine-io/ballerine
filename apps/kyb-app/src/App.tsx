import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';
import { AppLoadingContainer } from '@app/components/organisms/AppLoadingContainer';
import { CustomerProvider } from '@app/components/providers/CustomerProvider';
import { useCustomerQuery } from '@app/hooks/useCustomerQuery';
import { useFlowContextQuery } from '@app/hooks/useFlowContextQuery';
import { useUISchemasQuery } from '@app/hooks/useUISchemasQuery';
import { router } from '@app/router';
import '@ballerine/ui/dist/style.css';
import * as Sentry from '@sentry/react';
import { RouterProvider } from 'react-router-dom';

export const App = () => {
  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(),
    useFlowContextQuery(),
  ] as const;

  return (
    <Sentry.ErrorBoundary>
      <AppLoadingContainer dependencies={dependancyQueries}>
        <CustomerProvider
          loadingPlaceholder={<LoadingScreen />}
          fallback={CustomerProviderFallback}
        >
          <RouterProvider router={router} />
        </CustomerProvider>
      </AppLoadingContainer>
    </Sentry.ErrorBoundary>
  );
};

(window as any).toggleDevmode = () => {
  const key = 'devmode';
  const isDebug = localStorage.getItem(key);

  isDebug ? localStorage.removeItem(key) : localStorage.setItem(key, 'true');

  location.reload();
};
