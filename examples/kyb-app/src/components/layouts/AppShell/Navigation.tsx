import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

export const Navigation = () => {
  const { state } = useDynamicUIContext();
  const { stateApi } = useStateManagerContext();

  return (
    <div
      className={clsx('select-none cursor-pointer ', {
        'pointer-events-none opacity-50': state.isLoading,
      })}
      onClick={() => stateApi.sendEvent('PREVIOUS')}
    >
      <ArrowLeft className="inline" />
      <span className="pl-2 align-middle text-sm font-bold">Back</span>
    </div>
  );
};
