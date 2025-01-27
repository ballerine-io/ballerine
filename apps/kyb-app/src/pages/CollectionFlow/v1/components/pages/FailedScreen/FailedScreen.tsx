import { useCustomer } from '@/components/providers/CustomerProvider';
import { useFlowTracking } from '@/hooks/useFlowTracking';
import { CollectionFlowEvents } from '@/hooks/useFlowTracking/enums';
import { useUIOptionsRedirect } from '@/hooks/useUIOptionsRedirect';
import { Card } from '@ballerine/ui';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const FailedScreen = () => {
  const { t } = useTranslation();
  const { customer } = useCustomer();

  const { trackEvent } = useFlowTracking();

  useEffect(() => {
    trackEvent(CollectionFlowEvents.FLOW_FAILED);
  }, []);

  useUIOptionsRedirect('failure');

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex flex-col items-center gap-9">
          <img src={customer?.logoImageUri} className="max-h-[25%] max-w-[25%]" />
          <img src="/failed-circle.svg" className="h-[100px] w-[100px]" />
        </div>
        <div className="mb-10">
          <h1 className="mb-6 text-center text-3xl font-bold leading-8">{t('failed.header')}</h1>
          <p className="text-muted-foreground text-center text-sm leading-5 opacity-50">
            {t('failed.content', { companyName: customer?.displayName })}
          </p>
        </div>
      </Card>
    </div>
  );
};
