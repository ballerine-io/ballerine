import { Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen">
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Outlet />
      </QueryParamProvider>
    </div>
  );
};
