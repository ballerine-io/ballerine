import { LoadingSpinner } from '@/common/components/atoms/LoadingSpinner';

export const LoadingScreen = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner className="text-primary-foreground" size={'48'} />
    </div>
  );
};
