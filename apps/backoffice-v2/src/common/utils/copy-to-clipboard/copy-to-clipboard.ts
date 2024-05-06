import { toast } from 'sonner';
import { t } from 'i18next';

export const copyToClipboard = (text: string) => async () => {
  await navigator.clipboard.writeText(text);

  toast.success(t(`toast:copy_to_clipboard`, { text }));
};
