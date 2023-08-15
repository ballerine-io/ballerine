import '@ballerine/ui/dist/style.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/common/utils/query-client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@app/router';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
2;
