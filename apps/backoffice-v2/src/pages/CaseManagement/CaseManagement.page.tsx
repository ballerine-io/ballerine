import { useSelectEntityFilterOnMount } from '@/domains/entities/hooks/useSelectEntityFilterOnMount/useSelectEntityFilterOnMount';
import { isCustomApiConfigured } from '@/common/api-client/custom-api-client';
import { useHealthQuery } from '@/pages/Root/hooks/useHealthQuery/useHealthQuery';
import { Outlet } from 'react-router-dom';

export const CaseManagement = () => {
  useSelectEntityFilterOnMount();
  const { isError: isApiUnhealthy, isSuccess: isApiHealthy } = useHealthQuery();
  const hasCustomApi = isCustomApiConfigured();

  return (
    <div className={`grid h-full grid-cols-[340px_1fr] grid-rows-[auto_1fr]`}>
      <div className="col-span-full flex items-center gap-3 border-b border-neutral/10 bg-base-100 px-4 py-1.5 text-xs theme-dark:border-neutral/60">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isApiHealthy ? 'bg-green-500' : isApiUnhealthy ? 'bg-red-500' : 'bg-yellow-500'
            }`}
          />
          <span className="text-muted-foreground">
            API: {isApiHealthy ? 'Connected' : isApiUnhealthy ? 'Disconnected' : 'Checking...'}
          </span>
        </div>
        {hasCustomApi && (
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Custom API: Configured</span>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};
