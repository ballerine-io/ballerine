import type { FunctionComponent } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { FullScreenLoader } from '@/common/components/molecules/FullScreenLoader/FullScreenLoader';
import { SidebarInset, SidebarProvider } from '@/common/components/organisms/Sidebar/Sidebar';
import { AppSidebar } from './components/AppSidebar';
import { useAuthenticatedLayoutLogic } from './hooks/useAuthenticatedLayoutLogic/useAuthenticatedLayoutLogic';

export const AuthenticatedLayout: FunctionComponent = () => {
  const { shouldRedirect, isLoading, redirectUnauthenticatedTo, location } =
    useAuthenticatedLayoutLogic();

  if (isLoading || !redirectUnauthenticatedTo) {
    return <FullScreenLoader />;
  }

  if (shouldRedirect) {
    return (
      <Navigate
        to={redirectUnauthenticatedTo}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return (
    <SidebarProvider
      style={{
        '--sidebar-width-mobile': '12rem',
        '--sidebar-width': '18rem',
        '--sidebar-width-xl': '24rem',
      }}
    >
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
