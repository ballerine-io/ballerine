import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { useCustomer } from '@/components/providers/CustomerProvider';
import { useAppExit } from '@/hooks/useAppExit/useAppExit';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { Button, Card } from '@ballerine/ui';

export const Approved = withSessionProtected(() => {
  const { t } = useTranslation();
  const { customer } = useCustomer();
  const exitFromApp = useAppExit();

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex flex-col items-center gap-9">
          <img src={customer?.logoImageUri} className="max-h-[25%] max-w-[25%]" />
          <img src="/success-circle.svg" className="h-[100px] w-[100px]" />
        </div>
        <div className="mb-10">
          <h1
            className="mb-6 text-center text-3xl font-bold leading-8"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t('approved.header') as string),
            }}
          />
          <p className="text-muted-foreground text-center text-sm leading-5 opacity-50">
            {t('approved.content', { companyName: customer?.displayName })}
          </p>
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
