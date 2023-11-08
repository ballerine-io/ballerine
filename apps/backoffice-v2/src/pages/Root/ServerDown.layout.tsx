import { FunctionComponent } from 'react';
import { useHealthQuery } from './hooks/useHealthQuery/useHealthQuery';
import { Outlet } from 'react-router-dom';
import { ErrorAlert } from '../../common/components/atoms/ErrorAlert/ErrorAlert';
import { FullScreenLoader } from '../../common/components/molecules/FullScreenLoader/FullScreenLoader';

export const ServerDownLayout: FunctionComponent = () => {
  const { isSuccess, isLoading } = useHealthQuery();

  if (isLoading) return <FullScreenLoader />;
  if (isSuccess) return <Outlet />;

  return (
    <main className={`flex h-full flex-col items-center`}>
      <ErrorAlert>Our services are temporarily down.</ErrorAlert>
    </main>
  );
};
