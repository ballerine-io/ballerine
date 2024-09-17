import { useUIOptionsRedirect } from '@/hooks/useUIOptionsRedirect';

export const Failed = () => {
  useUIOptionsRedirect('failure');

  debugger;

  return null;
};
