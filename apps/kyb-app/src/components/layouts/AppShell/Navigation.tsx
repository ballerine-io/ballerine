import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useCustomer } from '@/components/providers/CustomerProvider';
import { useAppExit } from '@/hooks/useAppExit/useAppExit';
import { ctw } from '@ballerine/ui';

export const Navigation = () => {
  const { state } = useDynamicUIContext();
  const { t } = useTranslation();
  const { stateApi } = useStateManagerContext();
  const { currentPage } = usePageResolverContext();
  const { customer } = useCustomer();
  const exitFromApp = useAppExit();

  const isFirstStep = currentPage?.number === 1;
  const isDisabled = state.isLoading;

  const onPrevious = useCallback(() => {
    if (!isFirstStep) {
      stateApi.sendEvent('PREVIOUS');
      return;
    }

    exitFromApp();
    return;
  }, [stateApi, exitFromApp]);

  return (
    <button
      className={ctw('cursor-pointer select-none ', {
        'pointer-events-none opacity-50': isDisabled,
      })}
      aria-disabled={isDisabled}
      onClick={onPrevious}
      type={'button'}
    >
      <ArrowLeft className="inline" />
      <span className="pl-2 align-middle text-sm font-bold">
        {isFirstStep && customer
          ? t('backToPortal', { companyName: customer.displayName })
          : t('back')}
      </span>
    </button>
  );
};
