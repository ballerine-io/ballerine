import { Outlet } from 'react-router-dom';
import { useSelectEntityFilterOnMount } from '@/domains/entities/hooks/useSelectEntityFilterOnMount/useSelectEntityFilterOnMount';

export const CaseManagement = () => {
  useSelectEntityFilterOnMount();

  return (
    <div className={`grid h-full grid-cols-[300px_1fr]`}>
      <Outlet />
    </div>
  );
};
