import { Outlet } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export const DashboardLayout = () => {
  return (
    <div className="box-border flex h-screen flex-col">
      {/* <div>Navigation</div> */}
      <div className="flex-1 overflow-auto">
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Outlet />
        </QueryParamProvider>
      </div>
    </div>
  );
};
