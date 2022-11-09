import { toast } from "@zerodevx/svelte-toast";
import { t } from '../../contexts/translation/hooks';

export const checkIsCameraAvailable = async (): Promise<boolean> => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return true;
  } catch (error) {
    toast.push(t('general', 'errorCameraAccess'));
    return false;
  }
}
