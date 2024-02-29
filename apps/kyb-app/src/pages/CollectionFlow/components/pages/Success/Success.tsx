import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { useCustomer } from '@/components/providers/CustomerProvider';
import { useAppExit } from '@/hooks/useAppExit/useAppExit';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { Button, Card } from '@ballerine/ui';

export const Success = withSessionProtected(() => {
  const { t } = useTranslation();
  const { customer } = useCustomer();

  const exitFromApp = useAppExit();

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
        {customer?.displayName && (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={exitFromApp}>
              {t('backToPortal', { companyName: customer.displayName })}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
});
