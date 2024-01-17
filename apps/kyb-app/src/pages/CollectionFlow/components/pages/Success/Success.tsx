import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { useCustomer } from '@/components/providers/CustomerProvider';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { Button, Card } from '@ballerine/ui';
import { useEffect } from 'react';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import set from 'lodash/set';
import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { useFlowContextQuery } from '@/hooks/useFlowContextQuery';

// TODO: Find a way to make this work via the workflow-browser-sdk `subscribe` method.
export const useCompleteLastStep = () => {
  const { stateApi } = useStateManagerContext();
  const { language } = useLanguageParam();
  const { data: schema } = useUISchemasQuery(language);
  const { refetch } = useFlowContextQuery();
  const elements = schema?.uiSchema?.elements;

  useEffect(() => {
    (async () => {
      const { data: context } = await refetch();

      if (!context) return;

      set(context, `flowConfig.stepsProgress.${elements?.at(-1)?.stateName}.isCompleted`, true);
      await stateApi.invokePlugin('sync_workflow_runtime');
    })();
  }, []);
};

export const Success = withSessionProtected(() => {
  const { t } = useTranslation();
  const { customer } = useCustomer();

  useCompleteLastStep();

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
        {customer?.displayName && customer?.websiteUrl && (
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                location.href = customer.websiteUrl;
              }}
            >
              {t('backToPortal', { companyName: customer.displayName })}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
});
