import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { ctw } from '@ballerine/ui';

export const Navigation = () => {
  const { state } = useDynamicUIContext();
  const { t } = useTranslation();
  const { stateApi } = useStateManagerContext();
  const { currentPage } = usePageResolverContext();

  const isFirstStep = currentPage?.number === 1;
  const isDisabled = state.isLoading || isFirstStep;

  const onPrevious = useCallback(() => {
    return stateApi.sendEvent('PREVIOUS');
  }, [stateApi]);

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
      <span className="pl-2 align-middle text-sm font-bold">{t('back')}</span>
    </button>
  );
};
