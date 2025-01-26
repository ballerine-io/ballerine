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
  const { stateApi, payload } = useStateManagerContext();
  const { currentPage } = usePageResolverContext();
  const { customer } = useCustomer();
  const { exit, isExitAvailable } = useAppExit();

  const currentPageNumber =
    Number(
      payload?.collectionFlow?.state?.steps?.findIndex(
        step => step.stepName === currentPage?.stateName,
      ),
    ) + 1;

  const isFirstStep = currentPageNumber === 1;
  const isDisabled = state.isLoading;

  const onPrevious = useCallback(async () => {
    if (!isFirstStep) {
      await stateApi.sendEvent('PREVIOUS');

      return;
    }

    exit();

    return;
  }, [stateApi, exit, isFirstStep]);

  if (isFirstStep && !isExitAvailable) return null;

  return (
    <button
      className={ctw('flex cursor-pointer select-none flex-row flex-nowrap items-center', {
        'pointer-events-none opacity-50': isDisabled,
      })}
      aria-disabled={isDisabled}
      onClick={onPrevious}
      type={'button'}
    >
      <ArrowLeft size={24} className="flex-shrink-0" />
      <span className="flex flex-nowrap pl-2 align-middle text-sm font-bold">
        {isFirstStep && customer
          ? t('backToPortal', { companyName: customer.displayName })
          : t('back')}
      </span>
    </button>
  );
};
