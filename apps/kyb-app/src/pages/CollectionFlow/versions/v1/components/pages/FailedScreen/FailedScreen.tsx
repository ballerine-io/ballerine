import { useCustomer } from '@/components/providers/CustomerProvider';
import { Card } from '@ballerine/ui';
import { Loader2 } from 'lucide-react';
import { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface IFailedScreenProps {
  redirectUrl?: string;
}

export const FailedScreen: FunctionComponent<IFailedScreenProps> = ({ redirectUrl }) => {
  const { t } = useTranslation();
  const { customer } = useCustomer();

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

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
        {redirectUrl && (
          <div className="mt-4 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
            <span className="ml-2 text-sm text-gray-500">Redirecting...</span>
          </div>
        )}
      </Card>
    </div>
  );
};
