import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { KYBView } from '@app/components/organisms/KYBView';
import { queryClient } from '@app/common/utils/query-client';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <KYBView />
    </QueryClientProvider>
  );
};
2;
