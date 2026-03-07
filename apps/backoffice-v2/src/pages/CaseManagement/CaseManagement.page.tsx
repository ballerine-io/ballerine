import { useSelectEntityFilterOnMount } from '@/domains/entities/hooks/useSelectEntityFilterOnMount/useSelectEntityFilterOnMount';
import { Outlet } from 'react-router-dom';

export const CaseManagement = () => {
  useSelectEntityFilterOnMount();

  return (
    <div className={`grid h-full grid-cols-[340px_1fr] grid-rows-[1fr]`}>
      <Outlet />
    </div>
  );
};
