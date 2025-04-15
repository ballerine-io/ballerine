import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { useCustomer } from '@/components/providers/CustomerProvider';
import { useAppExit } from '@/hooks/useAppExit/useAppExit';
import { Button, Card } from '@ballerine/ui';
import { FunctionComponent, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ICompletedScreenProps {
  redirectUrl?: string;
}

export const CompletedScreen: FunctionComponent<ICompletedScreenProps> = ({ redirectUrl }) => {
  const { t } = useTranslation();
  const { customer } = useCustomer();

  const { exit, isExitAvailable } = useAppExit();

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex justify-center">
          <img src="/papers-checked.svg" className="max-h-[25%] max-w-[25%]" />
        </div>
        <div className="mb-10">
          <h1
            className="mb-6 text-center text-3xl font-bold leading-8"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t('success.header') as string),
            }}
          />
          <h2 className="text-muted-foreground text-center text-sm leading-5 opacity-50">
            {t('success.content')}
          </h2>
        </div>
        {customer?.displayName && isExitAvailable && (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={exit}>
              {t('backToPortal', { companyName: customer.displayName })}
            </Button>
          </div>
        )}
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
