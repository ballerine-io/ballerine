import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { useUIOptionsRedirect } from '@/hooks/useUIOptionsRedirect';

export const Failed = () => {
  useUIOptionsRedirect('failure');

  return <LoadingScreen />;
};
