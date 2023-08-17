import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="text-primary-foreground animate-spin" size={'48'} />
    </div>
  );
};
