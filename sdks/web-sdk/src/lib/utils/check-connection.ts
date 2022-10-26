import { toast } from '@zerodevx/svelte-toast';

export const initConnectionCheck = (t: (module: string, key: string) => string) => {
  window.addEventListener('online', () => {
    toast.push(t('general', 'online'));
  });
  window.addEventListener('offline', () => {
    toast.push(t('general', 'offline'));
  });
};
