import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/common/utils/query-client';
import { KYB } from '@app/components/organisms/KYBView';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <KYB />
    </QueryClientProvider>
  );
};
2;
