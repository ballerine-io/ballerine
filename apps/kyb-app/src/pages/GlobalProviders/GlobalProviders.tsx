import { AccessTokenProvider } from '@/common/providers/AccessTokenProvider';
import { DependenciesProvider } from '@/common/providers/DependenciesProvider';
import { Outlet } from 'react-router-dom';

export const GlobalProviders = () => {
  return (
    <AccessTokenProvider>
      <DependenciesProvider>
        <Outlet />
      </DependenciesProvider>
    </AccessTokenProvider>
  );
};
