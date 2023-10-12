import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';

export const Navigation = () => {
  const { state } = useDynamicUIContext();
  const { stateApi } = useStateManagerContext();
  const isDisabled = state.isLoading;
  const onPrevious = useCallback(() => {
    return stateApi.sendEvent('PREVIOUS');
  }, [stateApi]);

  return (
    <button
      className={clsx('cursor-pointer select-none ', {
        'pointer-events-none opacity-50': isDisabled,
      })}
      aria-disabled={isDisabled}
      onClick={onPrevious}
      type={'button'}
    >
      <ArrowLeft className="inline" />
      <span className="pl-2 align-middle text-sm font-bold">Back</span>
    </button>
  );
};
