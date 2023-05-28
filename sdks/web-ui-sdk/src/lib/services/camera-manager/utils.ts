import { toast } from '@zerodevx/svelte-toast';
import { t } from '../../contexts/translation/hooks';

export const checkIsCameraAvailable = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    return true;
  } catch (error) {
    console.error(error);
    toast.push(t('general', 'errorCameraAccess'));
    return false;
  }
};
