import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/common/utils/query-client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/router';
import { CustomerProvider } from '@app/components/providers/CustomerProvider';
import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
import { CustomerProviderFallback } from '@app/components/molecules/CustomerProviderFallback';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider loadingPlaceholder={<LoadingScreen />} fallback={CustomerProviderFallback}>
        <RouterProvider router={router} />
      </CustomerProvider>
    </QueryClientProvider>
  );
};
2;
