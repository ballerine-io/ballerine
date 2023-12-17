import '@ballerine/ui/dist/style.css';
import { AppLoadingContainer } from '@/components/organisms/AppLoadingContainer';
import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';
import { CustomerProvider } from '@/components/providers/CustomerProvider';
import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@/components/molecules/CustomerProviderFallback';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import * as Sentry from '@sentry/react';

export const App = () => {
  const language = new URLSearchParams(window.location.search).get('lng') || 'en';

  const dependancyQueries = [
    useCustomerQuery(),
    useUISchemasQuery(language),
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
