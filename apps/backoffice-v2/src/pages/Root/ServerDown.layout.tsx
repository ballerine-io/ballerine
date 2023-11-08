import { FunctionComponent } from 'react';
import { useHealthQuery } from './hooks/useHealthQuery/useHealthQuery';
import { Outlet } from 'react-router-dom';
import { ErrorAlert } from '../../common/components/atoms/ErrorAlert/ErrorAlert';

export const ServerDownLayout: FunctionComponent = () => {
  const { isSuccess, isLoading } = useHealthQuery();

  if (isSuccess || isLoading) return <Outlet />;

  return (
    <main className={`flex h-full flex-col items-center`}>
      <ErrorAlert>Our services are temporarily down.</ErrorAlert>
    </main>
  );
};
