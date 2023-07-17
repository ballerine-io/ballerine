import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from '@app/components/layouts/AppShell';
import { KYBView } from '@app/components/organisms/KYBView';
import { queryClient } from '@app/common/utils/query-client';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <KYBView />
      </AppShell>
    </QueryClientProvider>
  );
};
2;
