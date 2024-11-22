import { useCustomerQuery } from '@/hooks/useCustomerQuery';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { useLanguage } from '@/hooks/useLanguage';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useCallback } from 'react';
import { CollectionFlowEvents } from '../useFlowTracking/enums';

export const useAppExit = () => {
  const appLanguage = useLanguage();
  const { data: uiSchema } = useUISchemasQuery(appLanguage);
  const { customer } = useCustomerQuery();
  const { trackEvent } = useFlowTracking();

  const kybOnExitAction = uiSchema?.config?.kybOnExitAction || 'send-event';

  const exit = useCallback(() => {
    if (kybOnExitAction === 'send-event') {
      trackEvent(CollectionFlowEvents.USER_EXITED);

      return;
    }

    if (kybOnExitAction === 'redirect-to-customer-portal') {
      if (customer?.websiteUrl) {
        location.href = customer?.websiteUrl;
      }
    }
  }, [trackEvent, customer]);

  return {
    exit,
    isExitAvailable: kybOnExitAction === 'send-event' ? true : !!customer?.websiteUrl,
  };
};
