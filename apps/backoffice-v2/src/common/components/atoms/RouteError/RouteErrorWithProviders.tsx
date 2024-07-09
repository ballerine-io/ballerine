import { Providers } from '@/common/components/templates/Providers/Providers';
import { RouteError } from '@/common/components/atoms/RouteError/RouteError';

export const RouteErrorWithProviders = () => {
  return (
    <Providers>
      <RouteError />
    </Providers>
  );
};
