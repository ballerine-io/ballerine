import { Outlet } from 'react-router-dom';
import { useSelectEntityFilterOnMount } from '@/domains/entities/hooks/useSelectEntityFilterOnMount/useSelectEntityFilterOnMount';

export const CaseManagement = () => {
  useSelectEntityFilterOnMount();

  return <Outlet />;
};
