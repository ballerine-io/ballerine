import { useSettings } from '@app/common/providers/SettingsProvider/hooks/useSettings';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

export const BackButton = () => {
  const { state, isFinished, prev } = useViewState();
  const { leaveText } = useSettings();

  const isExit = useMemo(() => state === 'personalInformation', [state]);

  return (
    <div
      className={clsx('select-none', { 'pointer-events-none opacity-50': isFinished })}
      onClick={!isExit ? prev : () => alert('Not implemented')}
    >
      <ArrowLeft className="inline" />
      <span className="cursor-pointer pl-2 align-middle text-sm font-bold">
        {isExit ? leaveText : 'Back'}
      </span>
    </div>
  );
};
