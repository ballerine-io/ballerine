import { useHealthQuery } from './hooks/useHealthQuery/useHealthQuery';
import { ErrorAlert } from '../../common/components/atoms/ErrorAlert/ErrorAlert';
import { FullScreenLoader } from '../../common/components/molecules/FullScreenLoader/FullScreenLoader';
import { FunctionComponentWithChildren } from '@ballerine/ui';

export const ServerDownLayout: FunctionComponentWithChildren = ({ children }) => {
  const { isSuccess, isLoading } = useHealthQuery();

  if (isLoading) return <FullScreenLoader />;

  if (isSuccess) return children;

  return (
    <main className={`flex h-full flex-col items-center`}>
      <ErrorAlert>Our services are temporarily down.</ErrorAlert>
    </main>
  );
};
